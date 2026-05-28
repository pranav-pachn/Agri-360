# API Documentation

The AgriMitra 360 backend exposes a set of RESTful endpoints to handle crop image analysis, chat, weather, and analytics. Below is the documentation for the primary endpoints.

---

## Analysis & Inference

### `POST /api/analyze`
Analyze a crop image and return structured diagnosis, risk, yield, trust, and recommendation data.
- **Content-Type**: `multipart/form-data`
- **Body Parameters**:
  - `image`: (File) The crop image to analyze.
  - `location`: (String, Optional) The location of the farm (e.g., "Guntur").
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "analysisId": "uuid-string",
    "disease": "Tomato Blight",
    "confidence": 0.85,
    "severity": "High",
    "riskScore": 72,
    "projectedYield": 4.5,
    "trustScore": 680,
    "recommendations": ["Use fungicide...", "Ensure proper drainage..."]
  }
  ```

### `GET /api/analysis/:id`
Fetch a previously stored analysis result.
- **Parameters**:
  - `id`: The UUID of the analysis.
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "disease": "Tomato Blight",
      "riskScore": 72,
      "createdAt": "2026-05-28T12:00:00Z"
    }
  }
  ```

---

## Analytics

### `GET /api/v1/analytics`
Fetch aggregated analytics for broader agricultural intelligence.
- **Query Parameters**:
  - `district`: (Optional) Filter by district.
  - `crop`: (Optional) Filter by crop type.
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "totalReports": 151,
      "averageRisk": 45.2,
      "topDiseases": [
        {"name": "Blight", "count": 34}
      ]
    }
  }
  ```

---

## Assistant

### `POST /api/v1/chat`
Context-aware assistant chat endpoint.
- **Content-Type**: `application/json`
- **Body Parameters**:
  - `message`: (String) The user's message.
  - `farmerId`: (String, Optional) ID to load contextual data.
  - `language`: (String, Optional) "en", "hi", or "te".
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "reply": "Based on your recent tomato scan, the risk is high due to weather."
  }
  ```

---

## Farmer Data

### `GET /api/v1/farmers/:farmerId/details`
Fetch farmer profile plus recent crop reports and credit snapshot.
- **Parameters**:
  - `farmerId`: The UUID of the farmer.
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "farmer": {
        "id": "uuid",
        "name": "Ramu",
        "location": "Guntur"
      },
      "reports": [],
      "creditScore": 680
    }
  }
  ```

---

## Weather

### `GET /api/v1/weather/current`
Fetch live weather snapshot with structured risk impact output.
- **Query Parameters**:
  - `location`: (String, Required) The location to fetch weather for.
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "temp": 32.5,
      "humidity": 65,
      "description": "Scattered clouds",
      "riskImpact": 1.2
    }
  }
  ```