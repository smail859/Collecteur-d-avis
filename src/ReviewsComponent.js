import React, { useEffect, useState } from "react";

const ReviewsComponent = ({ accountId, locationId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchReviews = async () => {
      const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`;
      const apiKey = "YOUR_API_KEY_HERE"; 
  
      try {
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_ACCESS_TOKEN_HERE`, 
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setReviews(data.reviews || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchReviews();
    }, [accountId, locationId]);
  
    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div>
        <h1>Reviews</h1>
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.reviewId}>
                <h3>{review.reviewer.displayName}</h3>
                <p>{review.comment}</p>
                <p>Rating: {review.starRating}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default ReviewsComponent;