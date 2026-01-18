// // // import { useAuth } from "@/contexts/AppContext";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuTrigger,
// // // } from "@/components/ui/dropdown-menu";
// // // import { Bell, Search } from "lucide-react";

// // // export function Header({ title, subtitle }) {
// // //   const { user } = useAuth();

// // //   return (
// // //     <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
// // //       <div className="flex items-center justify-between px-6 py-4">
// // //         <div>
// // //           <h1 className="text-2xl font-display font-bold text-foreground">
// // //             {title}
// // //           </h1>
// // //           {subtitle && (
// // //             <p className="text-sm text-muted-foreground">{subtitle}</p>
// // //           )}
// // //         </div>

// // //         <div className="flex items-center gap-4">
// // //           {/* <div className="hidden md:flex relative">
// // //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // //             <Input placeholder="Search..." className="pl-9 w-64 bg-muted/50" />
// // //           </div> */}

// // //           <DropdownMenu>
// // //             <DropdownMenuTrigger asChild>
// // //               <Button variant="ghost" size="icon" className="relative">
// // //                 <Bell className="h-5 w-5" />
// // //                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
// // //                   3
// // //                 </span>
// // //               </Button>
// // //             </DropdownMenuTrigger>
// // //             <DropdownMenuContent align="end" className="w-80 bg-popover">
// // //               <div className="p-3 border-b">
// // //                 <h3 className="font-semibold">Notifications</h3>
// // //               </div>
// // //               <DropdownMenuItem>New booking from Vikram Mehta</DropdownMenuItem>
// // //               <DropdownMenuItem>Room 103 cleaning completed</DropdownMenuItem>
// // //               <DropdownMenuItem>
// // //                 Payment received for INV-2024-001
// // //               </DropdownMenuItem>
// // //             </DropdownMenuContent>
// // //           </DropdownMenu>

// // //           {user && (
// // //             <div className="flex items-center gap-3">
// // //               <div className="hidden md:block text-right">
// // //                 <p className="text-sm font-medium">{user.name}</p>
// // //                 <p className="text-xs text-muted-foreground capitalize">
// // //                   {user.role}
// // //                 </p>
// // //               </div>
// // //               <Avatar>
// // //                 <AvatarFallback className="bg-primary text-primary-foreground">
// // //                   {user.name
// // //                     .split(" ")
// // //                     .map((n) => n[0])
// // //                     .join("")}
// // //                 </AvatarFallback>
// // //               </Avatar>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // }
// // import { useAuth } from "@/contexts/AppContext";
// // import { authAPI } from "@/api/auth"; // Adjust this path to where your auth.js is
// // import { Button } from "@/components/ui/button";
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { Bell, User, Key, LogOut } from "lucide-react";
// // import { useNavigate } from "react-router-dom"; // Or 'next/navigation' if using Next.js

// // export function Header({ title, subtitle }) {
// //   const { user, setUser } = useAuth(); // Assuming setUser exists in your context
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     authAPI.logout();
// //     if (setUser) setUser(null); // Clear context state
// //     navigate("/login"); // Redirect to login page
// //   };

// //   return (
// //     <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
// //       <div className="flex items-center justify-between px-6 py-4">
// //         <div>
// //           <h1 className="text-2xl font-display font-bold text-foreground">
// //             {title}
// //           </h1>
// //           {subtitle && (
// //             <p className="text-sm text-muted-foreground">{subtitle}</p>
// //           )}
// //         </div>

// //         <div className="flex items-center gap-4">
// //           {/* Notifications Dropdown */}
// //           <DropdownMenu>
// //             <DropdownMenuTrigger asChild>
// //               <Button variant="ghost" size="icon" className="relative">
// //                 <Bell className="h-5 w-5" />
// //                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
// //                   3
// //                 </span>
// //               </Button>
// //             </DropdownMenuTrigger>
// //             <DropdownMenuContent align="end" className="w-80">
// //               <div className="p-3 border-b">
// //                 <h3 className="font-semibold">Notifications</h3>
// //               </div>
// //               <DropdownMenuItem>New booking from Vikram Mehta</DropdownMenuItem>
// //               <DropdownMenuItem>Room 103 cleaning completed</DropdownMenuItem>
// //             </DropdownMenuContent>
// //           </DropdownMenu>

// //           {/* User Profile Dropdown */}
// //           {user && (
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <button className="flex items-center gap-3 hover:bg-muted/50 p-1 rounded-lg transition-colors outline-none">
// //                   <div className="hidden md:block text-right">
// //                     <p className="text-sm font-medium">{user.name}</p>
// //                     <p className="text-xs text-muted-foreground capitalize">
// //                       {user.role}
// //                     </p>
// //                   </div>
// //                   <Avatar>
// //                     <AvatarFallback className="bg-primary text-primary-foreground">
// //                       {user.name
// //                         ?.split(" ")
// //                         .map((n) => n[0])
// //                         .join("")}
// //                     </AvatarFallback>
// //                   </Avatar>
// //                 </button>
// //               </DropdownMenuTrigger>

// //               <DropdownMenuContent align="end" className="w-56">
// //                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
// //                 <DropdownMenuSeparator />

// //                 <DropdownMenuItem onClick={() => navigate("/profile")}>
// //                   <User className="mr-2 h-4 w-4" />
// //                   <span>Profile Settings</span>
// //                 </DropdownMenuItem>

// //                 <DropdownMenuItem onClick={() => navigate("/change-password")}>
// //                   <Key className="mr-2 h-4 w-4" />
// //                   <span>Change Password</span>
// //                 </DropdownMenuItem>

// //                 <DropdownMenuSeparator />

// //                 <DropdownMenuItem
// //                   onClick={handleLogout}
// //                   className="text-destructive focus:text-destructive"
// //                 >
// //                   <LogOut className="mr-2 h-4 w-4" />
// //                   <span>Log out</span>
// //                 </DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           )}
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AppContext";
// import { authAPI } from "@/api/auth"; // Adjust this path to your auth.js
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Bell, User, Key, LogOut, Loader2 } from "lucide-react";

// export function Header({ title, subtitle }) {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   // Modal States
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // --- Actions ---

//   const handleLogout = () => {
//     authAPI.logout();
//     if (setUser) setUser(null);
//     navigate("/login");
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.currentTarget);
//     const data = { name: formData.get("name") };

//     try {
//       const response = await authAPI.updateProfile(data);
//       if (response.success) {
//         // Update local storage and context with new user data
//         const updatedUser = { ...user, name: data.name };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         if (setUser) setUser(updatedUser);
//         setShowProfileModal(false);
//       }
//     } catch (error) {
//       console.error("Profile update failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const currentPassword = formData.get("currentPassword");
//     const newPassword = formData.get("newPassword");
//     const confirmPassword = formData.get("confirmPassword");

//     if (newPassword !== confirmPassword) {
//       alert("New passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await authAPI.changePassword({ currentPassword, newPassword });
//       setShowPasswordModal(false);
//       alert("Password updated successfully!");
//     } catch (error) {
//       console.error("Password change failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
//         <div className="flex items-center justify-between px-6 py-4">
//           <div>
//             <h1 className="text-2xl font-display font-bold text-foreground">
//               {title}
//             </h1>
//             {subtitle && (
//               <p className="text-sm text-muted-foreground">{subtitle}</p>
//             )}
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Notifications */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative">
//                   <Bell className="h-5 w-5" />
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
//                     3
//                   </span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-80 bg-popover">
//                 <div className="p-3 border-b">
//                   <h3 className="font-semibold">Notifications</h3>
//                 </div>
//                 <DropdownMenuItem>
//                   New booking from Vikram Mehta
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>Room 103 cleaning completed</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* User Profile Menu */}
//             {user && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button className="flex items-center gap-3 hover:bg-muted/50 p-1 rounded-lg transition-colors outline-none text-left">
//                     <div className="hidden md:block">
//                       <p className="text-sm font-medium">{user.name}</p>
//                       <p className="text-xs text-muted-foreground capitalize">
//                         {user.role}
//                       </p>
//                     </div>
//                     <Avatar>
//                       <AvatarFallback className="bg-primary text-primary-foreground">
//                         {user.name
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                   </button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onSelect={() => setShowProfileModal(true)}>
//                     <User className="mr-2 h-4 w-4" />
//                     <span>Profile</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onSelect={() => setShowPasswordModal(true)}>
//                     <Key className="mr-2 h-4 w-4" />
//                     <span>Change Password</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-destructive focus:text-destructive"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Logout</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* --- POPUP MODALS --- */}

//       {/* Edit Profile Modal */}
//       <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Profile Settings</DialogTitle>
//             <DialogDescription>
//               Update your personal information.
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleUpdateProfile} className="space-y-4 py-2">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" name="name" defaultValue={user?.name} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <Input
//                 id="email"
//                 value={user?.email}
//                 disabled
//                 className="bg-muted"
//               />
//               <p className="text-[10px] text-muted-foreground">
//                 Email cannot be changed.
//               </p>
//             </div>
//             <DialogFooter>
//               <Button type="submit" disabled={loading}>
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Save Changes
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Change Password Modal */}
//       <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Change Password</DialogTitle>
//             <DialogDescription>
//               Ensure your account is using a long, random password to stay
//               secure.
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleChangePassword} className="space-y-4 py-2">
//             <div className="space-y-2">
//               <Label htmlFor="currentPassword">Current Password</Label>
//               <Input
//                 id="currentPassword"
//                 name="currentPassword"
//                 type="password"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="newPassword">New Password</Label>
//               <Input
//                 id="newPassword"
//                 name="newPassword"
//                 type="password"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm New Password</Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 required
//               />
//             </div>
//             <DialogFooter>
//               <Button type="submit" disabled={loading}>
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Update Password
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AppContext";
import { authAPI } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Key, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import NotificationBell from "@/components/notifications/NotificationBell";

export function Header({ title, subtitle }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Data States
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // --- Fetch Profile Data ---
  const fetchLatestProfile = async () => {
    setFetching(true);
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setFetching(false);
    }
  };

  // Trigger fetch when modal opens
  useEffect(() => {
    if (showProfileModal) {
      fetchLatestProfile();
    }
  }, [showProfileModal]);

  // --- Handlers ---

  const handleLogout = () => {
    authAPI.logout();
    if (setUser) setUser(null);
    navigate("/login");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const updatePayload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      const response = await authAPI.updateProfile(updatePayload);
      if (response.success) {
        // Sync context with the updated name for the header UI
        const updatedUser = { ...user, name: updatePayload.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);
        setShowProfileModal(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setShowPasswordModal(false);
      toast.success("Password updated successfully!");
      handleLogout();
    } catch (error) {
      console.error("Password change failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-muted/50 p-1 rounded-lg transition-colors outline-none text-left cursor-pointer">
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setShowProfileModal(true)}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowPasswordModal(true)}>
                    <Key className="mr-2 h-4 w-4" /> Change Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>
              Update your contact information here.
            </DialogDescription>
          </DialogHeader>

          {fetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profileData?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    defaultValue={profileData?.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={profileData?.phone}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={profileData?.username}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={profileData?.role}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current and new password below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
