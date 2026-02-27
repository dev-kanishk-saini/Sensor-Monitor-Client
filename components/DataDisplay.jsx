"use client";
export default function DataDisplay({ data }) {

  if (!data) return null;

  return (
    <div style={{ marginTop: "20px" }}>

      <h3>Snapshot Details</h3>

      <p>ID: {data.id}</p>

      <p>Moving Target Distance: {data.movingtargetdistance}</p>

      <p>Static Target Distance: {data.statictargetdistance}</p>

      <p>Detection Distance: {data.detectiondistance}</p>

      <p>Signal Strength: {data.movingtargetsignalstrength}</p>

      <p>Created At: {data.created_at}</p>

    </div>
  );
}