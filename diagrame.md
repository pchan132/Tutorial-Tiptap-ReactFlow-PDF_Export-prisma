sequenceDiagram
%% --- Define participants ---
participant User as User
participant Client as React App
participant Google as Google Auth
participant Server as Backend API

%% --- Start process ---
User->>+Client: 1. Click "Login with Google"

Client->>+Google: 2. Request authentication (Open Pop-up)

Google-->>User: User enters email/password and authenticates

%% --- Authentication flow ---
alt Login Success
Google-->>-Client: 3. [OK] Send Token/Auth Code back

    Client->>+Server: 4. Send Google Token to Backend for verification
    Server->>Server: 5. Verify Token with Google (if needed)
    Server->>Server: 6. Find or create User in Database
    Server->>Server: 7. Create our own Session Token (JWT)
    Server-->>-Client: 8. [200 OK] Send Session Token (JWT)

    Client->>Client: 9. Save Session (store in Cookie/Storage)
    Client-->>-User: 10. Welcome! (redirect to /Dashboard)

else Login Failed
Google-->>-Client: 3. [Error] User cancelled or error occurred
Client-->>-User: 4. Show error message / stay on current page
end
