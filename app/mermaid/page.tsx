'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidPage() {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });

    if (mermaidRef.current) {
      mermaid.run();
    }
  }, []);

  const mermaidCode = `sequenceDiagram
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
end`;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Mermaid Diagram</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Google Authentication Flow</h2>
        
        <div className="mermaid" ref={mermaidRef}>
          {mermaidCode}
        </div>
      </div>

      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">คำอธิบาย Diagram</h3>
        <p className="text-gray-700">
          นี่คือ Sequence Diagram ที่แสดงกระบวนการ Authentication ผ่าน Google OAuth ในระบบของเรา
          แสดงขั้นตอนตั้งแต่การคลิกปุ่ม Login ไปจนถึงการเข้าสู่ระบบสำเร็จหรือล้มเหลว
        </p>
      </div>
    </div>
  );
}