"use client"

import AuthGuard from "@/components/AuthGuard"
import { useState, useEffect } from "react"
import { AccessKey, AdminNotice } from "@/lib/supabase"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Key,
  Calendar,
  Shield,
  Clock,
  Search,
  Settings,
  Bell,
  BarChart3,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CustomModal } from "@/components/CustomModal"
import AdminLoading from "@/components/AdminLoading"

export default function AdminUserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showNoticeDialog, setShowNoticeDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: () => {},
    showCancel: false,
  })

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    onConfirm?: () => void,
    showCancel = false,
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => setModal((prev) => ({ ...prev, isOpen: false }))),
      showCancel,
    })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await AccessKey.list("-created_at")
      setUsers(data)
    } catch (error) {
      console.error("Error loading users:", error)
      showModal("❌ Error", "Failed to load users: " + error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const generateAccessKey = (role = "admin") => {
    const prefix = role === "admin" ? "ADMIN" : "USER"
    const year = new Date().getFullYear()
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    const numberPart = Math.floor(Math.random() * 999) + 1
    return `${prefix}-${year}-${randomPart}-${numberPart.toString().padStart(3, "0")}`
  }

  const handleAddUser = async (userData) => {
    try {
      await AccessKey.create(userData)
      loadUsers()
      setShowAddDialog(false)
      showModal("✅ Success", `New ${userData.user_role} access key created successfully.`, "success")
    } catch (error) {
      showModal("❌ Error", "Failed to create user: " + error.message, "error")
    }
  }

  const handleUpdateUser = async (id, userData) => {
    try {
      await AccessKey.update(id, userData)
      loadUsers()
      setEditingUser(null)
      showModal("✅ Success", "User updated successfully.", "success")
    } catch (error) {
      showModal("❌ Error", "Failed to update user: " + error.message, "error")
    }
  }

  const handleDeleteUser = async (id, userName) => {
    showModal(
      "⚠️ Confirmation",
      `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      "warning",
      async () => {
        try {
          await AccessKey.delete(id)
          loadUsers()
          showModal("✅ Success", "User deleted successfully.", "success")
        } catch (error) {
          showModal("❌ Error", "Failed to delete user: " + error.message, "error")
        }
      },
      true,
    )
  }

  const handleToggleStatus = async (user) => {
    try {
      await AccessKey.update(user.id, { is_active: !user.is_active })
      loadUsers()
      showModal("✅ Success", `User ${user.is_active ? "deactivated" : "activated"} successfully.`, "success")
    } catch (error) {
      showModal("❌ Error", "Failed to update user status: " + error.message, "error")
    }
  }

  const handleSendNotice = async (noticeData) => {
    try {
      await AdminNotice.createNotice(
        noticeData.title,
        noticeData.message,
        noticeData.target_user || null,
        noticeData.expires_at || null,
      )
      setShowNoticeDialog(false)
      showModal("✅ Success", "Notice sent successfully.", "success")
    } catch (error) {
      showModal("❌ Error", "Failed to send notice: " + error.message, "error")
    }
  }

  const getRemainingDays = (expiresAt) => {
    if (!expiresAt) return "Unlimited"
    const expiryDate = new Date(expiresAt)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return "Expired"
    if (diffDays <= 7) return `${diffDays} days (Soon)`
    return `${diffDays} days`
  }

  const getStatusColor = (user) => {
    if (!user.is_active) return "secondary"
    if (user.expires_at && new Date(user.expires_at) < new Date()) return "destructive"
    return "default"
  }

  const getStatusText = (user) => {
    if (!user.is_active) return "Inactive"
    if (user.expires_at && new Date(user.expires_at) < new Date()) return "Expired"
    return "Active"
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.access_key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.is_active && (!user.expires_at || new Date(user.expires_at) >= new Date())) ||
      (filterStatus === "inactive" && !user.is_active) ||
      (filterStatus === "expired" && user.expires_at && new Date(user.expires_at) < new Date())
    const matchesRole = filterRole === "all" || user.user_role === filterRole

    return matchesSearch && matchesStatus && matchesRole
  })

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.user_role === "admin").length,
    users: users.filter((u) => u.user_role === "user").length,
    active: users.filter((u) => u.is_active && (!u.expires_at || new Date(u.expires_at) >= new Date())).length,
    expired: users.filter((u) => u.expires_at && new Date(u.expires_at) < new Date()).length,
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {loading ? (
          <AdminLoading message="Loading user management..." />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">User Management</h1>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Manage admin and user access keys, limits, and permissions
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Admins</p>
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.admins}</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Regular Users</p>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.users}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                    </div>
                    <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expired</p>
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.expired}</p>
                    </div>
                    <Clock className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users or access keys..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Send Notice
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-800 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-slate-900 dark:text-slate-100">Send Notice to Users</DialogTitle>
                        </DialogHeader>
                        <NoticeForm
                          users={users.filter((u) => u.user_role === "user")}
                          onSubmit={handleSendNotice}
                          onCancel={() => setShowNoticeDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New User
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-800 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-slate-900 dark:text-slate-100">
                            Create New Access Key
                          </DialogTitle>
                        </DialogHeader>
                        <UserForm
                          onSubmit={handleAddUser}
                          onCancel={() => setShowAddDialog(false)}
                          generateKey={generateAccessKey}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Users ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">No users found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {searchTerm || filterStatus !== "all" || filterRole !== "all"
                          ? "Try adjusting your search or filters"
                          : "Create your first access key"}
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <Card
                        key={user.id}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-md"
                      >
                        <CardContent className="p-4">
                          {editingUser?.id === user.id ? (
                            <UserEditForm
                              user={user}
                              onSave={(data) => handleUpdateUser(user.id, data)}
                              onCancel={() => setEditingUser(null)}
                            />
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    {user.user_role === "admin" ? (
                                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    ) : (
                                      <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                      {user.user_name}
                                    </h3>
                                  </div>
                                  <Badge variant={user.user_role === "admin" ? "default" : "secondary"}>
                                    {user.user_role === "admin" ? "Admin" : "User"}
                                  </Badge>
                                  <Badge variant={getStatusColor(user)}>{getStatusText(user)}</Badge>
                                </div>

                                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                  <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">
                                      {user.access_key}
                                    </code>
                                  </div>

                                  <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>Valid: {getRemainingDays(user.expires_at)}</span>
                                    </div>
                                    {user.user_role === "user" && (
                                      <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        <span>
                                          Limit: {user.used_generations || 0}/{user.generation_limit || 0}
                                        </span>
                                      </div>
                                    )}
                                    {user.last_login && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Last: {new Date(user.last_login).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant={user.is_active ? "destructive" : "default"}
                                  onClick={() => handleToggleStatus(user)}
                                >
                                  {user.is_active ? "Deactivate" : "Activate"}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(user.id, user.user_name)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <CustomModal
              isOpen={modal.isOpen}
              onClose={() => setModal({ ...modal, isOpen: false })}
              title={modal.title}
              message={modal.message}
              type={modal.type}
              onConfirm={modal.onConfirm}
              showCancel={modal.showCancel}
            />
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

function UserForm({ onSubmit, onCancel, generateKey }) {
  const [formData, setFormData] = useState({
    access_key: generateKey("admin"),
    user_name: "",
    user_role: "admin",
    generation_limit: 100,
    used_generations: 0,
    expires_at: "",
    is_active: true,
    created_by: "admin",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      expires_at: formData.expires_at || null,
      generation_limit: formData.user_role === "admin" ? null : formData.generation_limit,
      used_generations: formData.user_role === "admin" ? null : 0,
    }
    onSubmit(submitData)
  }

  const regenerateKey = () => {
    setFormData({ ...formData, access_key: generateKey(formData.user_role) })
  }

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      user_role: role,
      access_key: generateKey(role),
      generation_limit: role === "admin" ? null : 100,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="user_name">User Name</Label>
        <Input
          id="user_name"
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          placeholder="Enter user name"
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      <div>
        <Label htmlFor="user_role">User Role</Label>
        <Select value={formData.user_role} onValueChange={handleRoleChange}>
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin (Unlimited Access)</SelectItem>
            <SelectItem value="user">User (Limited Access)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.user_role === "user" && (
        <div>
          <Label htmlFor="generation_limit">Generation Limit</Label>
          <Input
            id="generation_limit"
            type="number"
            min="1"
            max="10000"
            value={formData.generation_limit}
            onChange={(e) => setFormData({ ...formData, generation_limit: Number.parseInt(e.target.value) || 100 })}
            className="bg-white dark:bg-slate-700"
            required
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maximum number of user agents this user can generate
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="access_key">Access Key</Label>
        <div className="flex gap-2">
          <Input
            id="access_key"
            value={formData.access_key}
            onChange={(e) => setFormData({ ...formData, access_key: e.target.value })}
            className="bg-white dark:bg-slate-700 font-mono text-sm"
            required
          />
          <Button type="button" variant="outline" onClick={regenerateKey}>
            <Key className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
        <Input
          id="expires_at"
          type="datetime-local"
          value={formData.expires_at}
          onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
          className="bg-white dark:bg-slate-700"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leave empty for unlimited access</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create {formData.user_role === "admin" ? "Admin" : "User"}</Button>
      </DialogFooter>
    </form>
  )
}

function UserEditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    user_name: user.user_name,
    access_key: user.access_key,
    user_role: user.user_role || "admin",
    generation_limit: user.generation_limit || 100,
    used_generations: user.used_generations || 0,
    expires_at: user.expires_at ? new Date(user.expires_at).toISOString().slice(0, 16) : "",
    is_active: user.is_active,
  })

  const generateAccessKey = (role = "admin") => {
    const prefix = role === "admin" ? "ADMIN" : "USER"
    const year = new Date().getFullYear()
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    const numberPart = Math.floor(Math.random() * 999) + 1
    return `${prefix}-${year}-${randomPart}-${numberPart.toString().padStart(3, "0")}`
  }

  const regenerateKey = () => {
    setFormData({ ...formData, access_key: generateAccessKey(formData.user_role) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      expires_at: formData.expires_at || null,
      generation_limit: formData.user_role === "admin" ? null : formData.generation_limit,
      used_generations: formData.user_role === "admin" ? null : formData.used_generations,
    }
    onSave(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user_name">User Name</Label>
          <Input
            id="user_name"
            value={formData.user_name}
            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
        <div>
          <Label htmlFor="user_role">Role</Label>
          <Select value={formData.user_role} onValueChange={(role) => setFormData({ ...formData, user_role: role })}>
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.user_role === "user" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="generation_limit">Generation Limit</Label>
            <Input
              id="generation_limit"
              type="number"
              min="1"
              max="10000"
              value={formData.generation_limit}
              onChange={(e) => setFormData({ ...formData, generation_limit: Number.parseInt(e.target.value) || 100 })}
              className="bg-white dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="used_generations">Used Generations</Label>
            <Input
              id="used_generations"
              type="number"
              min="0"
              value={formData.used_generations}
              onChange={(e) => setFormData({ ...formData, used_generations: Number.parseInt(e.target.value) || 0 })}
              className="bg-white dark:bg-slate-700"
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="access_key">Access Key</Label>
        <div className="flex gap-2">
          <Input
            id="access_key"
            value={formData.access_key}
            onChange={(e) => setFormData({ ...formData, access_key: e.target.value })}
            className="bg-white dark:bg-slate-700 font-mono text-sm"
            required
          />
          <Button type="button" variant="outline" onClick={regenerateKey} title="Generate new access key">
            <Key className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="expires_at">Expiry Date</Label>
        <Input
          id="expires_at"
          type="datetime-local"
          value={formData.expires_at}
          onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
          className="bg-white dark:bg-slate-700"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            Save
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}

function NoticeForm({ users, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_user: "",
    expires_at: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Notice Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter notice title"
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Enter notice message"
          className="bg-white dark:bg-slate-700"
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="target_user">Target User (Optional)</Label>
        <Select
          value={formData.target_user}
          onValueChange={(value) => setFormData({ ...formData, target_user: value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="Send to all users or select specific user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.user_name}>
                {user.user_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leave empty to send to all users</p>
      </div>

      <div>
        <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
        <Input
          id="expires_at"
          type="datetime-local"
          value={formData.expires_at}
          onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
          className="bg-white dark:bg-slate-700"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leave empty for permanent notice</p>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          Send Notice
        </Button>
      </DialogFooter>
    </form>
  )
}
