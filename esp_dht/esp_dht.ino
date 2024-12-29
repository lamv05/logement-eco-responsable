#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>
#include <Arduino.h>
#include <DHT.h>
#include <ArduinoJson.h>



#define LED 2

#define DHTPIN 14
#define DHTTYPE DHT11

DHT dht(DHTPIN,DHTTYPE);

const char* ssid = "abc";
const char* password = "123456789";

//Your Domain name with URL path or IP address with path
const char* serverName = "http://192.168.221.62:8000";

// char server_led_path = serverName+"/led";
// char server_sensor_path = serverName+"/data";

unsigned long lastTime = 0;
unsigned long timerDelay = 3000;

float temp;
StaticJsonDocument<300> JSONData;
String jsonString;

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  //dht.begin();

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP()); 
}

void loop() {

  
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  float hic = dht.computeHeatIndex(t, h, false);

  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, "http://192.168.97.62:8000/add-mesure/");

      // If you need an HTTP request with a content type: application/json, use the following:
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST("{\"value\":"+String(t)+",\"capteur_actionneur_id\":3}");
      Serial.print("Temp: ");
      Serial.println(t);
      Serial.print("Hum: ");
      Serial.println(h);
      
      Serial.print("HTTP POST Response code: ");
      Serial.println(httpResponseCode);
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    // lastTime = millis();
  }
  
  
  if ((millis() - lastTime) > timerDelay) {
    if(WiFi.status()== WL_CONNECTED){

              
      jsonString = httpGETRequest("http://192.168.97.62:8000/last-mesure?capteur_id=3");

      //jsonString = httpGETRequest("http://192.168.221.62:8000/get-temperature?city=paris");
      
      deserializeJson(JSONData, jsonString);
      
      Serial.println(jsonString);

      temp=JSONData["valeur"].as<float>();

      //temp=JSONData["main"]["temp"].as<float>();

      Serial.println("TEMP: ");
      Serial.println(temp);

      if (temp<25){
        digitalWrite(LED, HIGH);
        Serial.println("LED OFF");
      }
      else{
        digitalWrite(LED, LOW);
        Serial.println("LED ON");
      }
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
  delay(2000);
}

String httpGETRequest(const char* serverName) {
  WiFiClient client;
  HTTPClient http;
    
  // Your IP address with path or Domain name with URL path 
  http.begin(client, serverName);
  
  // If you need Node-RED/server authentication, insert user and password below
  //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");
  
  // Send HTTP POST request
  int httpResponseCode = http.GET();
  
  String payload = "{}"; 
  
  if (httpResponseCode>0) {
    Serial.print("HTTP GET Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;
}
