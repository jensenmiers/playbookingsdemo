// app/ui-test/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from 'src/components/ui/card';
import { Checkbox } from 'src/components/ui/checkbox';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select';
import { Switch } from 'src/components/ui/switch';
import { Textarea } from 'src/components/ui/textarea';
import { Button } from 'src/components/ui/button';

export default function UiTestPage() {
  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
        </CardHeader>
        <CardContent>This is a card content area.</CardContent>
      </Card>

      <div>
        <Label htmlFor="input">Input Component</Label>
        <Input id="input" placeholder="Type here..." />
      </div>

      <div>
        <Label htmlFor="textarea">Textarea Component</Label>
        <Textarea id="textarea" placeholder="Type more..." />
      </div>

      <div>
        <Label htmlFor="checkbox">Checkbox Component</Label>
        <Checkbox id="checkbox" />
      </div>

      <div>
        <Label htmlFor="switch">Switch Component</Label>
        <Switch id="switch" />
      </div>

      <div>
        <Label htmlFor="select">Select Component</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Button>Button Component</Button>
      </div>
    </div>
  );
}