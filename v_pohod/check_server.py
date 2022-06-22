import requests

response = requests.post('http://localhost:8000/api-token-auth/', {
			"username": 'admin',
			"password": 'admin'
		})

print(response.json())