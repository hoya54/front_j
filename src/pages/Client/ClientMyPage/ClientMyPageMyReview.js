import React, { useState } from "react";
import styles from "./ClientMyPageMyReview.module.css";
import { Icon } from "@iconify/react";
import axios from "axios";

const ClientMyPageMyReview = ({ reviews, setClick }) => {


  const deleteReview = (id) => {
    axios
      .post("/api/business/opinion/review/delete", { id: id })
      .then((res) => {
        console.log(res);
        setClick((prev) => !prev)
      });
  };


  const starRate = (star) => {
    const elements = [];
    for (let i = 0; i < star; i++) {
      elements.push(
        <Icon
          key={`full-${i}`}
          icon="openmoji:star"
          className={styles.star_icon}
        ></Icon>
      );
    }
    for (let i = 0; i < 5 - star; i++) {
      elements.push(
        <Icon
          key={`blank-${i}`}
          icon="ic:round-star-border"
          className={styles.border_star_icon}
        ></Icon>
      );
    }
    return elements;
  }

  

  return (
    <div className={styles.container}>
      <div className={styles.out_box}>
        <div className={styles.content_box}>
          {reviews.length ? (
            reviews.map((review) => (
              <div className={styles.in_box} key={review.id}>
                <div className={styles.review_top}>
                  {" "}
                  <div className={styles.review_top_left}>
                    {review.writerName}
                    <div>
                    {starRate(review.star)}
                    </div>
                  </div>{" "}
                  <div className={styles.review_delete}>
                    <div
                      className={styles.delete_btn}
                      onClick={() => deleteReview(review.id)}
                    >
                      <div>삭제</div>
                      <Icon
                        icon="grommet-icons:form-trash"
                        style={{ fontSize: "1.2rem" }}
                      ></Icon>
                    </div>
                  </div>
                </div>
                <div className={styles.review_email}>
                  {review.createdAt.substr(0, 10)}
                </div>
                <div className={styles.review_content}>{review.memo}</div>
              </div>
            ))
          ) : (
            <div className={styles.no_review}>작성한 리뷰가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientMyPageMyReview;
