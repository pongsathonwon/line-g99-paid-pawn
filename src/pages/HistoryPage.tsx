import React from "react";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";

function HistoryPage() {
  return (
    <div>
      HistoryPage
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <DisplayCard withBorder color={i % 3 === 0 ? "gold" : "red"}>
              <DisplayCard.Mute>
                <span>เลขที่สัญญา</span>
                <span>12345678</span>
              </DisplayCard.Mute>
              <DisplayCard.Mute>
                <span>วันครบกำหนด</span>
                <span>31/12/2568</span>
              </DisplayCard.Mute>
              <DisplayCard.Summary>
                <span>ยอดชำระ</span>
                <span>4950 บาท</span>
              </DisplayCard.Summary>
            </DisplayCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryPage;
