'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle, UserPlus } from 'lucide-react'
import type { InvitationStats } from '@/lib/types/invitation'

interface InvitationStatsProps {
  stats: InvitationStats
}

export function InvitationStats({ stats }: InvitationStatsProps) {
  const statCards = [
    {
      title: 'Pending Invitations',
      value: stats.pendingInvitations,
      icon: Clock,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Confirmed Users',
      value: stats.confirmedUsers,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UserPlus,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}