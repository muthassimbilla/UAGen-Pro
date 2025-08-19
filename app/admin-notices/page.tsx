"use client"

import AuthGuard from "@/components/AuthGuard"
import { useState, useEffect } from "react"
import { AdminNotice, AccessKey } from "@/lib/supabase"
import { Bell, Plus, Edit, Trash2, Calendar, Users, Clock, Search, Eye, EyeOff, MessageSquare } from "lucide-react"
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

export default function AdminNoticeManagement() {
  const [notices, setNotices] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)

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
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [noticesData, usersData] = await Promise.all([
        AdminNotice.list("-created_at"),
        AccessKey.filter({ user_role: "user" }),
      ])
      setNotices(noticesData)
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading data:", error)
      showModal("❌ Error", "Failed to load data: " + error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNotice = async (noticeData) => {
    try {
      await AdminNotice.createNotice(
        noticeData.title,
        noticeData.message,
        noticeData.target_user || null,
        noticeData.expires_at || null,
      )
      loadData()
      setShowAddDialog(false)
      showModal("✅ Success", "Notice created successfully.", "success")
    } catch (error) {
      showModal("❌ Error", "Failed to create notice: " + error.message, "error")
    }
  }

  const handleUpdateNotice = async (id, noticeData) => {
    try {
      await AdminNotice.update(id, noticeData)
      loadData()
      setEditingNotice(null)
      showModal("✅ Success", "Notice updated successfully.", "success")
    } catch (error) {
      showModal("❌ Error", "Failed to update notice: " + error.message, "error")
    }
  }

  const handleDeleteNotice = async (id, title) => {
    showModal(
      "⚠️ Confirmation",
      `Are you sure you want to delete notice "${title}"? This action cannot be undone.`,
      "warning",
      async () => {
        try {
          await AdminNotice.delete(id)
          loadData()
          showModal("✅ Success", "Notice deleted successfully.", "success")
        } catch (error) {
          showModal("❌ Error", "Failed to delete notice: " + error.message, "error")
        }
      },
      true,
    )
  }

  const handleToggleStatus = async (notice) => {
    try {
      await AdminNotice.update(notice.id, { is_active: !notice.is_active })
      loadData()
      showModal("✅ Success", `Notice ${notice.is_active ? "deactivated" : "activated"} successfully.`, "success")
    } catch (error) {
      showModal("❌ Error", "Failed to update notice status: " + error.message, "error")
    }
  }

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getStatusColor = (notice) => {
    if (!notice.is_active) return "secondary"
    if (isExpired(notice.expires_at)) return "destructive"
    return "default"
  }

  const getStatusText = (notice) => {
    if (!notice.is_active) return "Inactive"
    if (isExpired(notice.expires_at)) return "Expired"
    return "Active"
  }

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notice.target_user && notice.target_user.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && notice.is_active && !isExpired(notice.expires_at)) ||
      (filterStatus === "inactive" && !notice.is_active) ||
      (filterStatus === "expired" && isExpired(notice.expires_at))

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: notices.length,
    active: notices.filter((n) => n.is_active && !isExpired(n.expires_at)).length,
    expired: notices.filter((n) => isExpired(n.expires_at)).length,
    global: notices.filter((n) => !n.target_user).length,
    targeted: notices.filter((n) => n.target_user).length,
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {loading ? (
          <AdminLoading message="Loading notice management..." />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Notice Management</h1>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Create and manage notices for users across the platform
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Notices</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
                    <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
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

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Global</p>
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.global}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Targeted</p>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.targeted}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
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
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

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

                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Notice
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-800 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-slate-100">Create New Notice</DialogTitle>
                      </DialogHeader>
                      <NoticeForm users={users} onSubmit={handleAddNotice} onCancel={() => setShowAddDialog(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Notices List */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                  <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Notices ({filteredNotices.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredNotices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">No notices found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {searchTerm || filterStatus !== "all"
                          ? "Try adjusting your search or filters"
                          : "Create your first notice"}
                      </p>
                    </div>
                  ) : (
                    filteredNotices.map((notice) => (
                      <Card
                        key={notice.id}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-md"
                      >
                        <CardContent className="p-4">
                          {editingNotice?.id === notice.id ? (
                            <NoticeEditForm
                              notice={notice}
                              users={users}
                              onSave={(data) => handleUpdateNotice(notice.id, data)}
                              onCancel={() => setEditingNotice(null)}
                            />
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                                      {notice.title}
                                    </h3>
                                    <Badge variant={getStatusColor(notice)}>{getStatusText(notice)}</Badge>
                                    {notice.target_user ? (
                                      <Badge variant="outline">For: {notice.target_user}</Badge>
                                    ) : (
                                      <Badge variant="secondary">Global</Badge>
                                    )}
                                  </div>

                                  <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                                    {notice.message}
                                  </p>

                                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>Created: {new Date(notice.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {notice.expires_at && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          Expires: {new Date(notice.expires_at).toLocaleDateString()}
                                          {isExpired(notice.expires_at) && (
                                            <span className="text-red-500 ml-1">(Expired)</span>
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant={notice.is_active ? "destructive" : "default"}
                                    onClick={() => handleToggleStatus(notice)}
                                  >
                                    {notice.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {notice.is_active ? "Hide" : "Show"}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingNotice(notice)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteNotice(notice.id, notice.title)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
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

function NoticeForm({ users, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_user: "",
    expires_at: "",
    is_active: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      target_user: formData.target_user === "all" ? null : formData.target_user || null,
      expires_at: formData.expires_at || null,
    }
    onSubmit(submitData)
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
        <Button type="submit">Create Notice</Button>
      </DialogFooter>
    </form>
  )
}

function NoticeEditForm({ notice, users, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: notice.title,
    message: notice.message,
    target_user: notice.target_user || "all",
    expires_at: notice.expires_at ? new Date(notice.expires_at).toISOString().slice(0, 16) : "",
    is_active: notice.is_active,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      target_user: formData.target_user === "all" ? null : formData.target_user || null,
      expires_at: formData.expires_at || null,
    }
    onSave(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Notice Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          className="bg-white dark:bg-slate-700"
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="target_user">Target User</Label>
        <Select
          value={formData.target_user}
          onValueChange={(value) => setFormData({ ...formData, target_user: value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue />
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
