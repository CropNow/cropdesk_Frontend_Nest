
import React from "react"
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function App() {
  return (
   
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert className="warning">
        <CheckCircle2Icon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert  with icon, title and description.
        </AlertDescription>
      </Alert>
      <Alert className="sucess_alert">
        <PopcornIcon />
        <AlertTitle>
          This Alert has a title and an icon. No description.
        </AlertTitle>
      </Alert>
      <Alert variant="destructive" className="error_alert">
        <AlertCircleIcon />
        <AlertTitle>Unable to process your payment.</AlertTitle>
        <AlertDescription>
          <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="p-8">
        <Button variant="outline" className="secondary_btn m-8 ">Outline</Button>
        <Button  className="primary_btn m-8">Outline</Button>
      </div>
    </div>
    
  )
}


export default App