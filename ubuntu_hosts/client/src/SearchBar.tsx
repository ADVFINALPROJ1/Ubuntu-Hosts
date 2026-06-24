import { Button } from "./components/ui/button"
import { Field } from "./components/ui/field"
import { Input } from "./components/ui/input"
import './App.css'


export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input className="search_bar" type="search" placeholder="Search Events..." />
      <Button>Search</Button>
    </Field>
  )
}
