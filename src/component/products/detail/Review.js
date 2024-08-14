import React, { useState, useEffect } from "react";
import axios from "../../../api/axios.js";
import { PiStarFill, PiStarLight } from "react-icons/pi";

function Review({ prodNum }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [newReview, setNewReview] = useState({
    star: 0,
    content: "",
  });

  useEffect(() => {
    axios
      .get(`/main/review/${prodNum}`)
      .then((res) => {
        setReviews(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [prodNum]);

  const handleStarClick = (value) => {
    setRating(value);
    setNewReview((prev) => ({ ...prev, star: value }));
  };

  const handleInputChange = (e) => {
    setNewReview((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSubmit = () => {
    axios
      .post(`/main/reviewInsert`, {
        memNum: "mem0000003", // 추후 세션, localStorage에 저장된 memNum으로 변경 예정
        prodNum: prodNum,
        revStar: newReview.star,
        revCont: newReview.content,
      })
      .then((res) => {
        setReviews((prev) => [res, ...prev]);
        setNewReview({ star: 0, content: "" }); // 입력 초기화
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="review-card mb-3 p-3 border rounded d-flex">
        <div className="d-flex align-items-center mb-2" style={{ width: '20%' }}>
          <div id="myform" style={{ display: 'flex' }}>
            <div>
              {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <div
                    onClick={() => handleStarClick(i + 1)}
                    style={{
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    {i < rating ? (
                      <PiStarFill className="star-lg star-design" />
                    ) : (
                      <PiStarLight className="star-lg star-design" />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <span className="rating">{rating}점</span>
          </div>
        </div>
        <div
          style={{
            alignContent: "center",
            display: "flex",
            marginLeft: "20px",
            width: "80%",
            height: "50px"
          }}
        >
          <input
            type="text"
            className="form-control input-large"
            placeholder="리뷰를 적어주세요."
            value={newReview.content}
            onChange={handleInputChange}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.revNum}
            className="review-card mb-3 p-3 border rounded"
          >
            {review.memName}, {review.revStar}, {review.revCont}
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
}

export default Review;
