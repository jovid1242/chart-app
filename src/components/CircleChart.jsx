import React, { useEffect, useState } from "react";
import { Chart, PieSeries, Title } from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { Animation, Palette } from "@devexpress/dx-react-chart";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CircleChart = () => {
  let [dataChartCircle, setDataChartCircle] = useState([
    {
      type: "type_0",
      val: 0,
      typeName: "Не готов",
    },
    {
      type: "type_1",
      val: 0,
      typeName: "Частичная подготовка",
    },
    {
      type: "type_2",
      val: 0,
      typeName: "Готов",
    },
  ]);
  const [emty, setEmty] = useState(false);
  const location = useLocation();
  const removeFirstTag = location.hash.substring(1);
  const [title, setTitle] = useState("Успеваемость: ");

  const fetchData = () => {
    axios
      .get(
        `https://tgbot.f-simple.ru/bot/statistics.php?hash=${removeFirstTag}`
      )
      .then(({ data }) => {
        if (!data.data) {
          setEmty(true);
        } else {
          data.data.forEach((elm) => {
            const index = dataChartCircle.findIndex(
              (elem) => elem.type === elm.type
            );
            if (index !== -1) {
              dataChartCircle[index].val += elm.result;
            }
          });
          setTitle(title + data.user.name + " " + data.user.surname);
          setDataChartCircle([...dataChartCircle]);
        }
      })
      .catch((err) => {
        setEmty(true);
      });
    //
  };

  const studentPirsentGrade = (grade) => {
    const grades = dataChartCircle.reduce(function (el, current) {
      return el + current.val;
    }, 0);

    return ((grade * 100) / grades).toFixed(2);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      {emty ? (
        <div className="not-found">
          <h2>Данные не найдены</h2>
        </div>
      ) : (
        <div className="card">
          <Chart data={dataChartCircle}>
            <Palette scheme={["#d72f3d", "#d7e11d", "#239d3d"]} />
            <PieSeries
              valueField="val"
              argumentField="type"
              innerRadius={0.4}
            />
            <Title text={title} />
            <Animation />
          </Chart>
          <div className="user-result">
            {dataChartCircle.map((res, i) => {
              return (
                <div className="action-user" key={res.type}>
                  <div className="cirle">
                    <div className={"cirle-cl-" + i}></div>
                    {res.typeName}: {studentPirsentGrade(res.val) + "%"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CircleChart;
