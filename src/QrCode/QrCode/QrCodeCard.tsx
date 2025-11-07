import React from "react";
import QrCode, { type TPaymentData } from "./QrCode";

type TQrCodeCardProps = {
  paymentData: TPaymentData;
  qrWidth?: number;
};

const QrCodeCard = React.forwardRef<HTMLDivElement, TQrCodeCardProps>(
  ({ paymentData, qrWidth = 280 }, ref) => {
    return (
      <div
        ref={ref}
        data-capture="true"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/qr/qr_logo_full.png"
            alt="Payment Logo"
            style={{ height: "4rem", width: "auto", objectFit: "contain" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <QrCode paymentData={paymentData} width={qrWidth} />
        </div>

        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#4B5563",
            }}
          >
            เลขที่สัญญาขายฝาก: {paymentData.ref1}
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#4B5563",
            }}
          >
            หรัสลูกค้า: {paymentData.ref2}
          </p>
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            จำนวน: {parseFloat(paymentData.amount).toFixed(2)}
          </p>
        </div>
      </div>
    );
  }
);

QrCodeCard.displayName = "QrCodeCard";

export default QrCodeCard;
