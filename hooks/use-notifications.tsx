'use client'

import type { Notification } from '@/types/notification'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Maximum number of notifications to store
const MAX_NOTIFICATIONS = 50

interface NotificationStore {
	notifications: Notification[]
	addNotification: (
		notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
	) => void
	removeNotification: (id: string) => void
	clearNotifications: () => void
	markAsRead: (id: string) => void
	markAllAsRead: () => void
}

export const useNotifications = create<NotificationStore>()(
	persist(
		(set) => ({
			notifications: [],

			addNotification: (notification) =>
				set((state) => {
					// Add new notification at the beginning and limit the total count
					const updatedNotifications = [
						{
							id: uuidv4(),
							createdAt: new Date().toISOString(),
							read: false,
							...notification,
						},
						...state.notifications,
					].slice(0, MAX_NOTIFICATIONS)

					return { notifications: updatedNotifications }
				}),

			removeNotification: (id) =>
				set((state) => ({
					notifications: state.notifications.filter(
						(notification) => notification.id !== id
					),
				})),

			clearNotifications: () => set({ notifications: [] }),

			markAsRead: (id) =>
				set((state) => ({
					notifications: state.notifications.map((notification) =>
						notification.id === id
							? { ...notification, read: true }
							: notification
					),
				})),

			markAllAsRead: () =>
				set((state) => ({
					notifications: state.notifications.map((notification) => ({
						...notification,
						read: true,
					})),
				})),
		}),
		{
			name: 'notifications-storage', // unique name for localStorage key
			storage: createJSONStorage(() => localStorage),
			// Only store the notifications array
			partialize: (state) => ({ notifications: state.notifications }),
			// Handle cases where localStorage might not be available
			onRehydrateStorage: () => (state) => {
				if (state) {
					console.log('Hydrated notifications from localStorage')
				} else {
					console.warn('Failed to hydrate notifications from localStorage')
				}
			},
		}
	)
)

// Helper function to add notifications from anywhere in the app
export const notificationService = {
	info: (title: string, message: string) => {
		useNotifications.getState().addNotification({
			title,
			message,
			type: 'info',
		})
	},

	success: (title: string, message: string) => {
		useNotifications.getState().addNotification({
			title,
			message,
			type: 'success',
		})
	},

	warning: (title: string, message: string) => {
		useNotifications.getState().addNotification({
			title,
			message,
			type: 'warning',
		})
	},

	error: (title: string, message: string) => {
		useNotifications.getState().addNotification({
			title,
			message,
			type: 'error',
		})
	},
}
