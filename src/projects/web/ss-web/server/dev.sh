curl -X POST 127.0.0.1:3000/api\
  -H "Content-Type: application/json" \
  -d '{"token": "abc123xyz", "score": 1700}'

curl -X GET 127.0.0.1:3000/api


curl -X POST https://survivor.nerter.fr/api\
  -H "Content-Type: application/json" \
  -d '{"token": "abc123xyz", "score": 1700}'

curl -X GET https://survivor.nerter.fr/api 