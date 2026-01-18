// // import { MainLayout } from "@/components/layout/MainLayout";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // // import { useUsers } from "@/contexts/App";
// // import { UserCog, Plus, Mail, Contact } from "lucide-react";
// // import { usersAPI } from "@/api/users";
// // import { useQuery } from "@tanstack/react-query";

// // export default function Users() {
// //   const { data: users, isLoading: usersLoading } = useQuery({
// //     queryKey: ["users", { limit: 1 }],
// //     queryFn: () => usersAPI.getAll({ limit: 10 }),
// //     select: (response) => response.data.users,
// //   });

// //   return (
// //     <MainLayout
// //       title="User Management"
// //       subtitle="Manage system users and roles"
// //     >
// //       <div className="space-y-6 animate-fade-in">
// //         <div className="flex justify-end">
// //           <Button className="hotel-button-gold">
// //             <Plus className="h-4 w-4 mr-2" />
// //             Add User
// //           </Button>
// //         </div>

// //         <div className="grid gap-4">
// //           {users?.map((user) => (
// //             <Card key={user.id}>
// //               <CardContent className="p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex items-center gap-4">
// //                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
// //                       <UserCog className="h-6 w-6 text-primary" />
// //                     </div>
// //                     <div>
// //                       <h3 className="font-semibold">{user.name}</h3>
// //                       <p className="text-sm text-muted-foreground flex items-center gap-1">
// //                         <Mail className="h-3 w-3" />
// //                         {user.email}
// //                       </p>
// //                       <p className="text-sm text-muted-foreground flex items-center gap-1">
// //                         <Contact className="h-3 w-3" />
// //                         {user.phone}
// //                       </p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-4">
// //                     <Badge variant="outline" className="capitalize">
// //                       {user.role}
// //                     </Badge>
// //                     <Badge
// //                       className={
// //                         user.is_active === 1
// //                           ? "bg-green-100 text-green-700"
// //                           : "bg-red-100 text-red-700"
// //                       }
// //                     >
// //                       {user.is_active === 1 ? "Active" : "Inactive"}
// //                     </Badge>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       </div>
// //     </MainLayout>
// //   );
// // }
// import { useState } from "react";
// import { MainLayout } from "@/components/layout/MainLayout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   UserCog,
//   Plus,
//   Mail,
//   Contact,
//   Edit2,
//   Trash2,
//   Loader2,
//   ShieldCheck,
// } from "lucide-react";
// import { usersAPI } from "@/api/users";
// import { useQuery } from "@tanstack/react-query";
// import { useUserActions } from "@/hooks/useUsers"; // Import the hook we made above

// export default function Users() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   // Local Form State
//   const [formData, setFormData] = useState({
//     username: "",
//     name: "",
//     email: "",
//     phone: "",
//     role: "receptionist",
//     password: "",
//   });

//   // Fetch Users
//   const { data: users, isLoading } = useQuery({
//     queryKey: ["users"],
//     queryFn: () => usersAPI.getAll({ limit: 10 }),
//     select: (response) => response.data.users,
//   });

//   const { createMutation, updateMutation, deleteMutation } = useUserActions();

//   // Open Dialog for either Add or Edit
//   const handleOpen = (user = null) => {
//     if (user) {
//       setEditingUser(user);
//       setFormData({
//         username: user.username,
//         name: user.name,
//         email: user.email,
//         phone: user.phone || "",
//         role: user.role,
//         password: user.password, // Keep empty on edit
//       });
//     } else {
//       setEditingUser(null);
//       setFormData({
//         username: "",
//         name: "",
//         email: "",
//         phone: "",
//         role: "receptionist",
//         password: "",
//       });
//     }
//     setIsOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editingUser) {
//       // Update logic: we send ID and Data separately
//       await updateMutation.mutateAsync({ id: editingUser.id, data: formData });
//     } else {
//       // Create logic
//       await createMutation.mutateAsync(formData);
//     }
//     setIsOpen(false);
//   };

//   return (
//     <MainLayout title="User Management" subtitle="Manage system access">
//       <div className="space-y-6">
//         <div className="flex justify-end">
//           <Button className="hotel-button-gold" onClick={() => handleOpen()}>
//             <Plus className="h-4 w-4 mr-2" /> Add New User
//           </Button>
//         </div>

//         <div className="grid gap-4">
//           {isLoading ? (
//             <div className="flex justify-center p-10">
//               <Loader2 className="animate-spin text-primary" />
//             </div>
//           ) : (
//             users?.map((user) => (
//               <Card key={user.id} className="border-l-4 border-l-primary/20">
//                 <CardContent className="p-4 flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
//                       <UserCog className="h-5 w-5 text-slate-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold flex items-center gap-2">
//                         {user.name}
//                         <span className="text-xs font-normal text-muted-foreground">
//                           (@{user.username})
//                         </span>
//                       </h3>
//                       <div className="flex gap-4 text-xs text-muted-foreground">
//                         <span className="flex items-center gap-1">
//                           <Mail className="h-3 w-3" /> {user.email}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Contact className="h-3 w-3" /> {user.phone}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <Badge
//                       variant="secondary"
//                       className="uppercase text-[10px]"
//                     >
//                       {user.role}
//                     </Badge>
//                     <Badge
//                       className={
//                         user.is_active === 1
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }
//                     >
//                       {user.is_active === 1 ? "Active" : "Inactive"}
//                     </Badge>

//                     <div className="flex gap-1 border-l pl-4 ml-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleOpen(user)}
//                       >
//                         <Edit2 className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => deleteMutation.mutate(user.id)}
//                         disabled={deleteMutation.isPending}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Pop-up Form Dialog */}
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <ShieldCheck className="h-5 w-5 text-primary" />
//               {editingUser ? "Update User Permissions" : "Create System User"}
//             </DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-4 py-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Full Name</Label>
//                 <Input
//                   required
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Username</Label>
//                 <Input
//                   required
//                   value={formData.username}
//                   disabled={!!editingUser} // Usernames usually shouldn't change
//                   onChange={(e) =>
//                     setFormData({ ...formData, username: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Email Address</Label>
//               <Input
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Phone Number</Label>
//                 <Input
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Access Role</Label>
//                 <Select
//                   value={formData.role}
//                   onValueChange={(val) =>
//                     setFormData({ ...formData, role: val })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="receptionist">Receptionist</SelectItem>
//                     <SelectItem value="manager">Manager</SelectItem>
//                     <SelectItem value="admin">Administrator</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {!editingUser && (
//               <div className="space-y-2">
//                 <Label>Initial Password</Label>
//                 <Input
//                   type="password"
//                   required
//                   placeholder="At least 8 characters"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                 />
//               </div>
//             )}

//             <DialogFooter className="mt-6 gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="hotel-button-gold px-8"
//                 disabled={createMutation.isPending || updateMutation.isPending}
//               >
//                 {(createMutation.isPending || updateMutation.isPending) && (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 )}
//                 {editingUser ? "Save Changes" : "Create Account"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </MainLayout>
//   );
// }
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCog,
  Plus,
  Mail,
  Contact,
  Edit2,
  Loader2,
  ShieldCheck,
  Power,
  PowerOff,
  Key,
} from "lucide-react";
import PasswordResetModal from "@/components/auth/PasswordResetModal";
import { usersAPI } from "@/api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Users() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);

  // Single State for the whole form
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    role: "receptionist",
    is_active: 1, // 1 for active, 0 for inactive
    password: "",
  });

  // Fetch Users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersAPI.getAll({ limit: 50 }),
    select: (response) => response.data.users,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => usersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User created successfully");
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User updated successfully");
      setIsOpen(false);
    },
  });

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        is_active: user.is_active, // Load current status from DB
        password: user.password,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        name: "",
        email: "",
        phone: "",
        role: "receptionist",
        is_active: 1,
        password: "",
      });
    }
    setIsOpen(true);
  };

  const handlePasswordReset = (user) => {
    setSelectedUserForReset(user);
    setPasswordResetModalOpen(true);
  };

  const handlePasswordResetSuccess = () => {
    toast.success("Password reset successfully");
    setPasswordResetModalOpen(false);
    setSelectedUserForReset(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      // Sends EVERYTHING (name, phone, role, is_active) in one update call
      await updateMutation.mutateAsync({ id: editingUser.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  return (
    <MainLayout title="User Management" subtitle="System Access Control">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            className="hotel-button-gold shadow-md"
            onClick={() => handleOpen()}
          >
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            users?.map((user) => (
              <Card
                key={user.id}
                className="transition-all hover:border-primary/50"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {user.name}
                      </h3>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Contact className="h-3 w-3" /> {user.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <Badge variant="secondary" className="px-3">
                      {user.role}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          user.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          user.is_active ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(user)}
                      className="gap-2"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasswordReset(user)}
                        className="gap-2"
                      >
                        <Key className="h-3.5 w-3.5" /> Reset
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {editingUser ? "Edit Profile & Status" : "Create New User"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  required
                  disabled={!!editingUser}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Ex: +91 9876543210"
              />
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Status</Label>
                <Select
                  value={formData.is_active.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, is_active: parseInt(v) })
                  }
                >
                  <SelectTrigger
                    className={
                      formData.is_active
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    <div className="flex items-center gap-2">
                      {formData.is_active ? (
                        <Power className="h-3 w-3" />
                      ) : (
                        <PowerOff className="h-3 w-3" />
                      )}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Password must contain at least one uppercase letter, one
                  lowercase letter, and one number
                </p>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="hotel-button-gold min-w-[120px]"
                disabled={updateMutation.isLoading || createMutation.isLoading}
              >
                {updateMutation.isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : editingUser ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={passwordResetModalOpen}
        onClose={() => setPasswordResetModalOpen(false)}
        user={selectedUserForReset}
        onSuccess={handlePasswordResetSuccess}
      />
    </MainLayout>
  );
}
