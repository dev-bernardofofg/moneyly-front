"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, Clock, X } from "lucide-react";
import { useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  trigger: React.ReactNode;
}

export const NotificationsPopover = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  trigger
}: NotificationsPopoverProps) => {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="size-4 text-green-600" />;
      case "warning":
        return <Clock className="size-4 text-yellow-600" />;
      case "error":
        return <X className="size-4 text-red-600" />;
      default:
        return <Bell className="size-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-hidden" align="end">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs h-6 px-2"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <Separator className="mb-3" />

        <div className="max-h-64 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 transition-colors ${notification.read
                  ? "opacity-60"
                  : getNotificationColor(notification.type)
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead?.(notification.id)}
                        className="size-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                      >
                        <Check className="size-3 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(notification.id)}
                      className="size-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <X className="size-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 