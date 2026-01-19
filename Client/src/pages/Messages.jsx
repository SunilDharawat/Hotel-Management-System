import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useSMSMessages,
  useSMSStats,
  useSMSTemplates,
  useSendSMS,
  useSendBulkSMS,
  useCreateTemplate,
  useUpdateTemplate,
} from "@/hooks/useSMS";
import { useQuery } from "@tanstack/react-query";
import { customersAPI } from "@/api/customers";
import {
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Loader2,
  Users,
  Mail,
  BarChart3,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function Messages() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data
  const { data: messagesData, isLoading: messagesLoading } = useSMSMessages({
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: 50,
  });

  const { data: templatesData, isLoading: templatesLoading } =
    useSMSTemplates();
  const { data: statsData } = useSMSStats();
  const { data: customersData } = useQuery({
    queryKey: ["customers", { limit: 1000 }],
    queryFn: () => customersAPI.getAll({ limit: 1000 }),
  });

  const messages = messagesData?.messages || [];
  const templates = templatesData || [];
  const stats = statsData?.overall || {};
  const customers = customersData?.data?.customers || [];

  const statusColors = {
    sent: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const messageTypeColors = {
    booking_confirmation: "bg-blue-100 text-blue-700",
    check_in_reminder: "bg-purple-100 text-purple-700",
    check_out_reminder: "bg-orange-100 text-orange-700",
    payment_reminder: "bg-red-100 text-red-700",
    promotional: "bg-green-100 text-green-700",
    custom: "bg-gray-100 text-gray-700",
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setIsTemplateFormOpen(true);
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setIsTemplateFormOpen(true);
  };

  if (messagesLoading || templatesLoading) {
    return (
      <MainLayout title="Messages" subtitle="SMS notifications and templates">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Messages" subtitle="SMS notifications and templates">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Total Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.sent || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failed || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Message History</CardTitle>
                <div className="flex gap-2">
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => setIsComposeOpen(true)}
                    className="hotel-button-gold"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Send className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold">
                            {msg.customer_name || "Unknown"}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${
                              messageTypeColors[msg.message_type]
                            }`}
                          >
                            {msg.message_type.replace(/_/g, " ")}
                          </Badge>
                          <Badge className={statusColors[msg.status]}>
                            {msg.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {msg.phone_number}
                        </p>
                        <p className="text-sm mt-2 line-clamp-2">
                          {msg.content}
                        </p>
                        {msg.error_message && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {msg.error_message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {msg.sent_at
                            ? format(
                                parseISO(msg.sent_at),
                                "dd MMM yyyy, hh:mm a",
                              )
                            : format(
                                parseISO(msg.created_at),
                                "dd MMM yyyy, hh:mm a",
                              )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* SMS Templates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SMS Templates</CardTitle>
                <Button size="sm" variant="outline" onClick={handleNewTemplate}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {templates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No templates yet
                  </p>
                ) : (
                  templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleEditTemplate(tpl)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{tpl.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={tpl.is_active ? "default" : "secondary"}
                          >
                            {tpl.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Edit className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {tpl.type.replace(/_/g, " ")}
                      </Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tpl.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compose SMS Dialog */}
      <ComposeSMSDialog
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        templates={templates}
        customers={customers}
      />

      {/* Template Form Dialog */}
      <TemplateFormDialog
        isOpen={isTemplateFormOpen}
        onClose={() => {
          setIsTemplateFormOpen(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
      />
    </MainLayout>
  );
}

// Compose SMS Dialog Component
function ComposeSMSDialog({ isOpen, onClose, templates, customers }) {
  const [formData, setFormData] = useState({
    recipient_type: "customer",
    customer_id: "",
    phone_number: "",
    message_type: "custom",
    template_id: "",
    content: "",
  });

  const sendSMSMutation = useSendSMS();
  const sendBulkSMSMutation = useSendBulkSMS();

  const selectedTemplate = templates.find(
    (t) => t.id === parseInt(formData.template_id),
  );

  const handleSend = async () => {
    try {
      const payload = {
        message_type: formData.message_type,
        content: formData.content,
      };

      if (formData.template_id) {
        payload.template_id = parseInt(formData.template_id);
      }

      if (formData.recipient_type === "customer") {
        payload.customer_id = formData.customer_id;
        await sendSMSMutation.mutateAsync(payload);
      } else {
        payload.phone_number = formData.phone_number;
        await sendSMSMutation.mutateAsync(payload);
      }

      setFormData({
        recipient_type: "customer",
        customer_id: "",
        phone_number: "",
        message_type: "custom",
        template_id: "",
        content: "",
      });
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send SMS</DialogTitle>
          <DialogDescription>
            Send SMS notification to customers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Type */}
          <div>
            <Label>Recipient Type</Label>
            <Select
              value={formData.recipient_type}
              onValueChange={(value) =>
                setFormData({ ...formData, recipient_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Select Customer</SelectItem>
                <SelectItem value="phone">Enter Phone Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Selection */}
          {formData.recipient_type === "customer" && (
            <div>
              <Label>Customer</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, customer_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name} - {customer.contact_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Phone Number */}
          {formData.recipient_type === "phone" && (
            <div>
              <Label>Phone Number</Label>
              <Input
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>
          )}

          {/* Message Type */}
          <div>
            <Label>Message Type</Label>
            <Select
              value={formData.message_type}
              onValueChange={(value) =>
                setFormData({ ...formData, message_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="booking_confirmation">
                  Booking Confirmation
                </SelectItem>
                <SelectItem value="check_in_reminder">
                  Check-in Reminder
                </SelectItem>
                <SelectItem value="check_out_reminder">
                  Check-out Reminder
                </SelectItem>
                <SelectItem value="payment_reminder">
                  Payment Reminder
                </SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Template Selection */}
          <div>
            <Label>Use Template (Optional)</Label>
            <Select
              value={formData.template_id}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  template_id: value,
                  content:
                    templates.find((t) => t.id === parseInt(value))?.content ||
                    "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No template</SelectItem>
                {templates
                  .filter((t) => t.is_active)
                  .map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Content */}
          <div>
            <Label>Message</Label>
            <Textarea
              placeholder="Enter your message..."
              rows={6}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.content.length} / 1000 characters
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="flex-1 hotel-button-gold"
              disabled={
                sendSMSMutation.isPending ||
                !formData.content ||
                (formData.recipient_type === "customer" &&
                  !formData.customer_id) ||
                (formData.recipient_type === "phone" && !formData.phone_number)
              }
            >
              {sendSMSMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Template Form Dialog Component
function TemplateFormDialog({ isOpen, onClose, template }) {
  const [formData, setFormData] = useState({
    type: "custom",
    name: "",
    content: "",
    is_active: true,
  });

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  // Load template data when editing
  useState(() => {
    if (template) {
      setFormData({
        type: template.type,
        name: template.name,
        content: template.content,
        is_active: template.is_active,
      });
    } else {
      setFormData({
        type: "custom",
        name: "",
        content: "",
        is_active: true,
      });
    }
  }, [template]);

  const handleSave = async () => {
    try {
      if (template) {
        await updateMutation.mutateAsync({
          id: template.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Template Name</Label>
            <Input
              placeholder="Enter template name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="booking_confirmation">
                  Booking Confirmation
                </SelectItem>
                <SelectItem value="check_in_reminder">
                  Check-in Reminder
                </SelectItem>
                <SelectItem value="check_out_reminder">
                  Check-out Reminder
                </SelectItem>
                <SelectItem value="payment_reminder">
                  Payment Reminder
                </SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Content</Label>
            <Textarea
              placeholder="Enter template content. Use {{variable_name}} for variables."
              rows={6}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use {`{{customer_name}}, {{booking_number}}`} etc. for variables
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 hotel-button-gold"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formData.name ||
                !formData.content
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Template"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
