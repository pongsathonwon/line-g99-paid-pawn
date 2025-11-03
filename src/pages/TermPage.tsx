import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import React from "react";

function TermPage() {
  return (
    <div>
      <DisplayCard>
        <DisplayCard.Header>รายละเอียดและเงือนไข</DisplayCard.Header>
        <DisplayCard.Highlight color="mute" className="mb-4">
          ข้อตกลงการใช้งาน
        </DisplayCard.Highlight>
        <DisplayCard.OrderList>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
              veritatis soluta voluptate ea quisquam. Nemo sint, eius illum
              porro, sed obcaecati error nesciunt reprehenderit unde sequi ea
              natus nulla sapiente!
            </li>
          ))}
        </DisplayCard.OrderList>
      </DisplayCard>
    </div>
  );
}

export default TermPage;
