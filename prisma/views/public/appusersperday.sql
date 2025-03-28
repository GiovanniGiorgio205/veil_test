WITH user_dates AS (
  SELECT
    "AppUsers".instance_id,
    min(date("AppUsers".created_at)) OVER (PARTITION BY "AppUsers".instance_id) AS first_signup_date,
    date("AppUsers".created_at) AS registration_date,
    count(*) AS daily_count
  FROM
    "AppUsers"
  GROUP BY
    "AppUsers".instance_id,
    (date("AppUsers".created_at))
),
result_set AS (
  SELECT
    user_dates.instance_id,
    calendar_date.day AS date,
    COALESCE(user_dates.daily_count, (0) :: bigint) AS user_count
  FROM
    (
      (
        (
          SELECT
            user_dates_1.instance_id,
            user_dates_1.first_signup_date
          FROM
            user_dates user_dates_1
          GROUP BY
            user_dates_1.instance_id,
            user_dates_1.first_signup_date
        ) instance_dates
        CROSS JOIN LATERAL (
          SELECT
            (
              generate_series(
                (instance_dates.first_signup_date) :: timestamp WITH time zone,
                (date(NOW())) :: timestamp WITH time zone,
                '1 day' :: INTERVAL
              )
            ) :: date AS DAY
        ) calendar_date
      )
      LEFT JOIN user_dates ON (
        (
          (
            user_dates.instance_id = instance_dates.instance_id
          )
          AND (user_dates.registration_date = calendar_date.day)
        )
      )
    )
)
SELECT
  row_number() OVER (
    ORDER BY
      instance_id,
      date
  ) AS id,
  instance_id,
  date,
  user_count
FROM
  result_set
ORDER BY
  instance_id,
  date;