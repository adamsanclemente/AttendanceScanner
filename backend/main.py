import requests

while True:
    id_input = input("Enter ID: ")

    # Make POST API call here with a JSON body
    response = requests.post("http://localhost:5173/api/record/submit", json={"studentId": str(id_input)})

    # Check response status code

    # Print response
    print(response.text)
    if response.status_code == 200:
        print("API call successful")
    else:
        print("API call failed")
