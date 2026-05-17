# Dairy Stock Tracker Design

## Goal

Build a simple offline-first app for a dairy shop that tracks daily quantity movement for milk, paneer, and curd. The app is primarily used by one person on an Android phone, while exported data can later be used for graphs, analysis, and AI/ML demand prediction.

## Users

- Primary user: shop operator, using the app on an Android phone.
- Secondary user: owner/analyst, receiving exported data for analysis outside the app.

No staff accounts, permissions, or login system are required in version 1.

## Products And Units

- Milk: litres.
- Paneer: kilograms, allowing 2 decimal places.
- Curd: kilograms, allowing 2 decimal places.

## Core Daily Workflow

Each day has one entry row per product.

For every product, the app records:

- Date.
- Weekday.
- Product.
- Opening quantity.
- Made or received quantity.
- Sold quantity.
- Wasted quantity.
- Closing quantity.
- Stockout time, if the product finished.
- Missed customer count.
- Optional notes.

The app automatically carries closing quantity into the next day's opening quantity:

```text
next day opening_qty = previous day closing_qty
```

Manual correction is allowed because real shop stock can change due to counting mistakes, spills, spoilage, or overnight adjustments.

## Quantity Check

The app calculates an expected closing quantity:

```text
expected_closing = opening_qty + made_or_received_qty - sold_qty - wasted_qty
```

If the entered closing quantity differs from the expected closing quantity, the app shows a warning but still allows saving. This prevents accidental mistakes while not blocking real-world corrections.

## Missed Demand Tracking

When a product finishes before the day ends, the operator can mark it as sold out and record the stockout time.

After that, the product card shows a simple button:

```text
+1 missed customer
```

The missed customer count records people who came asking for the product after it was finished. This is important because it captures demand that did not become sales.

For later modeling, this supports demand estimates such as:

```text
estimated_demand = sold_qty + missed_customers_count * estimated_avg_customer_quantity
```

Version 1 records only the customer count, not the exact quantity each missed customer wanted.

## Dashboard

The app includes a simple on-phone dashboard for the operator.

Dashboard version 1 includes:

- Today's current status for milk, paneer, and curd.
- Simple graph of sold quantity over time for each product.
- Previous weekday averages, such as average milk sold on Mondays.
- Missed customer counts by product.
- Stockout history, including how often a product finished and at what time.
- Basic suggested stock range for tomorrow.

The dashboard should not rely only on the last 7 days. Predictions and suggestions should consider weekday patterns:

```text
Monday suggestion uses previous Mondays
Tuesday suggestion uses previous Tuesdays
...
Sunday suggestion uses previous Sundays
```

Recent trend can be shown as supporting context, but weekday history is the primary baseline.

## Simple Graphs

Version 1 should include simple, readable graphs:

- Line or bar graph for daily sold quantity.
- Product filter: milk, paneer, curd.
- Time range filter: last 7 days, last 30 days, all available data.
- Optional graph for missed customers over time.

Graphs should be easy to read on a phone and should not require advanced analytics knowledge.

## Export And Analysis

The app stores data locally on the Android phone and exports clean CSV files.

CSV export is the primary way to share data for analysis. It works well with:

- Excel.
- Google Sheets.
- Python.
- Power BI.
- AI/ML notebooks.

The exported CSV should preserve one row per product per day:

```csv
date,weekday,product,opening_qty,made_or_received_qty,sold_qty,wasted_qty,closing_qty,stockout_time,missed_customers_count,notes
```

Revenue, selling price, cost, and profit are out of scope for version 1, but the data model should allow those fields to be added later.

## Recommended Technical Approach

Build version 1 as an offline-first PWA:

- Runs in Chrome on Android.
- Can be installed to the home screen.
- Stores data locally on the phone.
- Exports CSV manually through share/download.
- Requires no backend server in version 1.

This is faster and simpler than a native Android app or online dashboard, while keeping the data usable for future analysis.

## Out Of Scope For Version 1

- Login and user accounts.
- Staff permissions.
- Live cloud sync.
- Online dashboard for remote viewing.
- Revenue and profit tracking.
- Full AI prediction inside the phone app.
- Play Store publishing.

## Future Enhancements

- Google Drive sync.
- Online dashboard for remote viewing.
- Price and revenue tracking.
- Weather or holiday tagging.
- Better demand estimation using missed customer quantity estimates.
- ML model trained from exported CSV.
- Alerts for products likely to sell out early.

## Success Criteria

- The operator can enter daily stock data quickly on an Android phone.
- Closing stock carries forward into the next day's opening stock.
- Sold-out products can record stockout time and missed customers immediately during the day.
- The dashboard shows simple graphs and weekday-based summaries.
- CSV export produces clean data suitable for later analysis and model training.
