from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

# Create folder for file uploads if it doesn't exist
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def format_currency(value):
    """ Format number as currency with $ symbol and commas. """
    return f"${value:.2f}"

@app.route('/upload', methods=['POST'])
def upload_file():
    print("=== Starting File Upload Process ===")
    
    # Check if the file part exists in the request
    if 'file' not in request.files:
        print("ERROR: No file part in the request.")
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    year = request.form.get('year')
    category_expenses = json.loads(request.form.get('categoryExpenses', '{}'))

    if not file or not year:
        print("ERROR: File and year are required.")
        return jsonify({"error": "File and year are required"}), 400

    # Save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    print(f"File saved at: {file_path}")

    # Debug: Check file contents
    print("=== File Content Preview ===")
    with open(file_path, 'r') as f:
        print(f.read(500))  # Read first 500 characters to confirm content

    # Read CSV with error handling
    try:
        df = pd.read_csv(file_path, encoding="utf-8")
    except Exception as e:
        print(f"ERROR: Could not read CSV file: {str(e)}")
        return jsonify({"error": "Could not read CSV file", "message": str(e)}), 500

    print("=== CSV Loaded Successfully ===")
    
    # Required columns check
    required_columns = ["Order Date", "Ship Date", "Quantity", "Price", "Cost", "Profit", "Product ID", "Order ID", "Customer ID", "Customer Name", "State"]
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        print(f"ERROR: Missing columns: {missing_columns}")
        return jsonify({"error": f"Missing columns: {missing_columns}"}), 400

    # Parse dates safely
    print("=== Parsing Dates ===")
    try:
        df["date"] = pd.to_datetime(df["Order Date"])
        df["Ship Date"] = pd.to_datetime(df["Ship Date"])
    except Exception as e:
        print(f"ERROR: Date parsing failed: {str(e)}")
        return jsonify({"error": "Date parsing failed", "message": str(e)}), 500

    if df["date"].isnull().all():
        print("ERROR: All dates failed to parse. Check date format.")
        return jsonify({"error": "Date parsing error. All dates are NaT."}), 500

    # Filter data for the specified year
    print(f"=== Filtering data for the year: {year} ===")
    df = df[df["date"].dt.year == int(year)]

    # Calculate total revenue, expense, and profit
    print("=== Calculating KPIs ===")
    try:
        total_revenue = (df["Quantity"] * df["Price"]).sum()
        total_expense = (df["Quantity"] * df["Cost"]).sum()
        total_profit = (df["Quantity"] * df["Profit"]).sum()
    except KeyError as e:
        print(f"ERROR: Calculation failed. Missing column: {str(e)}")
        return jsonify({"error": f"Missing column for calculation: {str(e)}"}), 500

    # Sum category expenses
    print("=== Calculating Category Expenses ===")
    category_expenses_total = sum(int(value.replace("$", "")) for value in category_expenses.values())
    total_expense += category_expenses_total

    # Monthly summary
    print("=== Generating Monthly Summary ===")
    df["month"] = df["date"].dt.strftime("%B-%y")
    df["month_sort"] = df["date"].dt.strftime("%Y-%m")
    
    monthly_data = df.groupby("month").agg(
        revenue=("Price", lambda x: format_currency((x * df.loc[x.index, "Quantity"]).sum())),
        expenses=("Cost", lambda x: format_currency((x * df.loc[x.index, "Quantity"]).sum())),
        profit=("Profit", lambda x: format_currency((x * df.loc[x.index, "Quantity"]).sum()))
    ).reset_index()

    monthly_data = monthly_data.merge(df[["month", "month_sort"]].drop_duplicates(), on="month")
    monthly_data = monthly_data.sort_values(by="month_sort").drop(columns=["month_sort"])

    # Daily summary
    print("=== Generating Daily Summary ===")
    daily_data = df.groupby(df["date"].dt.strftime("%Y-%m-%d")).agg(
        revenue=("Price", lambda x: format_currency((x * df.loc[x.index, "Quantity"]).sum())),
        expenses=("Cost", lambda x: format_currency((x * df.loc[x.index, "Quantity"]).sum())),
        profit=("Profit", lambda x: format_currency((x * df.loc[x.index, "Quantity"]).sum()))
    ).reset_index()
    daily_data = daily_data.sort_values(by="date")

    # KPI JSON
    kpi_data = [{
        "totalProfit": format_currency(total_profit),
        "totalRevenue": format_currency(total_revenue),
        "totalExpenses": format_currency(total_expense),
        "monthlyData": monthly_data.to_dict(orient="records"),
        "dailyData": daily_data.to_dict(orient="records"),
        "expensesByCategory": category_expenses
    }]

    # Products JSON
    print("=== Generating Product Data ===")
    products_data = df.groupby("Product ID").agg(
        price=("Price", "first"),
        expense=("Cost", "first"),
        totalQuantity=("Quantity", "sum"),
        product_name=("Product Name", "first"),
        category=("Category", "first"),
        sub_category=("Sub-Category", "first"),
        transactions=("Order ID", list),
    ).reset_index()

    products_data["totalSales"] = products_data["totalQuantity"] * products_data["price"]
    products_data["price"] = products_data["price"].apply(format_currency)
    products_data["expense"] = products_data["expense"].apply(format_currency)
    products_data["totalSales"] = products_data["totalSales"].apply(format_currency)
    products_data = products_data.rename(columns={"Product ID": "id"}).copy()
    products_data = products_data.to_dict(orient="records")

    # Transactions JSON
    print("=== Generating Transaction Data ===")
    transactions_data = df.groupby("Order ID").agg(
        transaction_date=("date", "first"),
        customer_id=("Customer ID", "first"),
        buyer_name=("Customer Name", "first"),
        amount=("Quantity", lambda x: (x * df.loc[x.index, "Price"]).sum()),
        productIds=("Product ID", list)
    ).reset_index()
    transactions_data = transactions_data.rename(columns={"Order ID": "id"})
    transactions_data["transaction_date"] = transactions_data["transaction_date"].astype(str)
    transactions_data["amount"] = transactions_data["amount"].apply(format_currency)
    transactions_data = transactions_data.to_dict(orient="records")

    # State revenue
    print("=== Calculating State Revenue ===")
    df["Revenue"] = df["Quantity"] * df["Price"]
    state_revenue_data = df.groupby("State")["Revenue"].sum().reset_index()
    state_revenue_data["Revenue"] = state_revenue_data["Revenue"].apply(lambda x: format_currency(x))
    state_revenue_data = state_revenue_data.sort_values(by="Revenue", ascending=False).to_dict(orient="records")

    response = {
        "kpis": kpi_data,
        "transactions": transactions_data,
        "products": products_data,
        "stateRevenue": state_revenue_data
    }

    print("=== Upload Complete! ===")
    return jsonify(response)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
