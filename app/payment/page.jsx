
import React from "react";
import PaymentForm from "./PaymentForm";

function page() {
  return (
    <div>
      <PaymentForm
        data={{
          username: "nikki",
          rpayID: "rzp_test_2c9z2aZoZf0q9u",
          rpaySecret: "dXr9wv9kCtTJ9Vg8Q6xO2s4c",
        }}
      />
    </div>
  );
}

export default page;
