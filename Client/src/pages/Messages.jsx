import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/contexts/AppContext';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Messages() {
  const { messages, templates } = useMessages();

  return (
    <MainLayout title="Messages" subtitle="SMS notifications and templates">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Message History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Send className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{msg.customerName}</p>
                        <Badge variant="outline" className="text-xs capitalize">{msg.messageType.replace('_', ' ')}</Badge>
                        <Badge className={msg.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.phoneNumber}</p>
                      <p className="text-sm mt-2 line-clamp-2">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{format(parseISO(msg.sentAt), 'dd MMM yyyy, hh:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SMS Templates</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map(tpl => (
                  <div key={tpl.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{tpl.name}</p>
                      <Badge variant={tpl.isActive ? 'default' : 'secondary'}>{tpl.isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tpl.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
