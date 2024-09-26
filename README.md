# HealthMind-AI
[Watch Demo Video](https://youtu.be/liKQrAlh_j8)

**Description:**  
HealthMind-AI is an AI-powered medical Q&A web application that leverages the **Bio-Medical-Llama-3-8B** model to provide accurate answers to medical-related questions. The frontend is built using **Angular**, and the backend is developed with **Spring Boot**, ensuring a seamless interaction between the user and the AI engine.

## Features:
- AI-driven medical question-answering using Bio-Medical-Llama-3-8B.
- Fast, secure, and scalable backend powered by Spring Boot.
- Intuitive and responsive frontend built with Angular.
- Provides expert-level medical answers in real-time.
- Users can send messages via text or voice for more flexibility in interaction.
- Conversation management features such as:
  - Rename conversations for easy identification.
  - Delete conversations to clear unwanted interactions.
  - Share conversations with others.
  

## Technologies Used:
- **Frontend:** Angular
- **Backend:** Spring Boot
- **AI Model:** Bio-Medical-Llama-3-8B (ContactDoctor)

## Project Structure:

- **BotUI:** Contains the Angular frontend for user interaction. It allows users to submit medical-related questions and receive real-time responses directly from the AI model. The frontend interacts with the model for generating responses.

- **Assistant_Backend:** The backend, built using Spring Boot, is responsible for saving user messages and conversations in a MySQL database. While the model interacts directly with the Angular frontend for answering questions, the backend securely stores the conversation history and user interactions for future reference.

- **Setup Model:** This File contains code that must be run in Google Colab to load the Bio-Medical-Llama-3-8B model. This setup ensures that the model is correctly initialized and available for generating medical responses.

- **Interactions:** Code that runs in Google Colab to generate an endpoint, allowing communication between the AI model hosted in Colab and the local Angular frontend. This setup enables the frontend to receive AI-generated responses in real-time, while the backend (Spring Boot) handles storing messages and conversations seamlessly.


## Setup Instructions:

1. **Clone the Repository:**
      ```bash
     git clone https://github.com/leoben5456/HealthMind-AI.git
     cd HealthMind-AI
2. **Backend Setup (Spring Boot):** 
   - Navigate to the Assistant_Backend directory.
   - Make sure you have Java and Maven installed.
   - Configure your MySQL database and update the application properties in src/main/resources/application.properties with your database credentials.
     ```bash
      mvn spring-boot:run
3. **Frontend Setup (Angular):** 
   - Navigate to the BotUI directory.
   - Install the necessary Angular dependencies:
     ```bash
     npm install
   - Start the Angular development server:
     ```bash
     ng serve

4. **Setting Up the AI Model (Google Colab):** 
   - Open Google Colab in your browser.
   - Copy and paste the contents of the Setup Model.txt file (which includes the Python code required to load the Bio-Medical-Llama-3-8B model) into a new notebook in Google Colab.
   - Once the model is successfully loaded, proceed to the next step. 
5. **Generate AI Interaction Endpoint:**
   - Copy and Paste the contents of the Interaction.txt file (which includes the Python code needed to generate an interaction endpoint) into Google Colab.
   - Run the code to expose an endpoint that allows communication between the AI model hosted in Colab and your local project.
   - Once the endpoint is live, copy the generated endpoint URL.
   - Update the Angular Frontend:
      - Open the file chat.service.ts in your Angular frontend project.
      - Find the line that defines the apiUrl variable in the ChatService class:
        ```bash
        private apiUrl = 'https://cfa3-35-240-192-41.ngrok-free.app/ask';
      - Replace the existing endpoint URL with the new endpoint URL you generated in Google Colab. It should look like this:
        ```bash
        private apiUrl = '<your-new-endpoint-url>/ask';
   - Save the changes and restart your Angular project to ensure that the new endpoint is being used for sending messages to the AI model.

## License 

This project is licensed under the MIT License. See the LICENSE file for more  details.
         