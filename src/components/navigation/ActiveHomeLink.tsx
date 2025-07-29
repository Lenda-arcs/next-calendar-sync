import {HomeLinkClient} from './HomeLinkClient'

interface ActiveHomeLinkProps {
  userId: string
}

export function ActiveHomeLink({ userId }: ActiveHomeLinkProps) {
  return <HomeLinkClient appName={"avara."} userId={userId} />
} 