#!/bin/bash
BASE_URL="http://localhost:5000"

echo "--- 1. Testing Root URL ---"
curl -s "$BASE_URL/" | python3 -m json.tool

echo -e "\n\n--- 2. Testing Weather API ---"
curl -s "$BASE_URL/api/weather?date=2023-12-01" | python3 -m json.tool

echo -e "\n\n--- 3. Testing GET All Bookings (Initial) ---"
curl -s "$BASE_URL/api/bookings" | python3 -m json.tool

echo -e "\n\n--- 4. Testing POST Create Booking ---"
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{
    "customerName": "Test User",
    "numberOfGuests": 2,
    "bookingDate": "2023-12-01",
    "bookingTime": "19:00",
    "cuisinePreference": "Italian",
    "seatingPreference": "indoor"
}' "$BASE_URL/api/bookings")
echo "$RESPONSE" | python3 -m json.tool

# Extract ID
ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('_id', ''))")

if [ ! -z "$ID" ]; then
    echo -e "\n\n--- 5. Testing GET Specific Booking (ID: $ID) ---"
    curl -s "$BASE_URL/api/bookings/$ID" | python3 -m json.tool

    echo -e "\n\n--- 6. Testing DELETE Booking (ID: $ID) ---"
    curl -s -X DELETE "$BASE_URL/api/bookings/$ID" | python3 -m json.tool
else
    echo -e "\n\n[!] Failed to create booking, skipping ID-based tests."
fi

echo -e "\n\n--- 7. Testing GET All Bookings (Final) ---"
curl -s "$BASE_URL/api/bookings" | python3 -m json.tool
