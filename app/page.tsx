import EventList from "@/components/EventList";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <h1>Welcome to ticketr
      <EventList/>
    </h1>
   </div>
  );
}
