import { Id } from '@/convex/_generated/dataModel'
import React from 'react'

const CancelEventButton = ({eventId}:{eventId:Id<"events">}) => {
  const event=eventId;
  console.log(event)
  return (
    <div>CancelEventButton</div>
  )
}

export default CancelEventButton