package main

import (
    "bufio"
    "fmt"
    "os"
	"bytes"
	"encoding/json"
	ioutil "io/ioutil"
	"net/http"
)

func main() {
	for {
		reader := bufio.NewReader(os.Stdin)
		fmt.Print("Enter ID: ")
		id, _ := reader.ReadString('\n')
		if(id == "exit\n") {
			break
		}
		// Create a new POST request with a JSON body a string named StudentId and the value of the id variable
		req, err := http.NewRequest("POST", "http://localhost:5173/api/record/submit", bytes.NewBuffer([]byte(`{"StudentId": "` + id + `"}`)))
		if err != nil {
			panic(err)
		}

		// Set the request header Content-Type to application/json to indicate that the request body is JSON
		req.Header.Set("Content-Type", "application/json")

		// Create a new HTTP client and send the request
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}

		// Close the response body when the function returns
		defer resp.Body.Close()

		// Read the response body into a byte array
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}

		// Create a new JSON decoder that reads from the response body
		decoder := json.NewDecoder(bytes.NewReader(body))

		// Create a new struct type to hold the decoded JSON
		type Response struct {
			id string
			StudentId string
			class_id string
			timestamp string
			status string
		}

		// Decode the JSON into the Response struct
		var response Response
		err = decoder.Decode(&response)
		if err != nil {
			panic(err)
		}

		// Print the decoded JSON
		fmt.Println(response)
	}

}