import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
  Legend,
} from "@devexpress/dx-react-chart-bootstrap4";
import { ArgumentScale, Animation } from "@devexpress/dx-react-chart";
import { curveCatmullRom, area } from "d3-shape";
import { scalePoint } from "d3-scale";

const Root = (props) => <Legend.Root {...props} className="m-auto flex-row" />;

const Area = (props) => (
  <AreaSeries.Path
    {...props}
    path={area()
      .x(({ arg }) => arg)
      .y1(({ val }) => val)
      .y0(({ startVal }) => startVal)
      .curve(curveCatmullRom)}
  />
);

const types = {
  type_0: "Не готов",
  type_1: "Частичная",
  type_2: "Готов",
};

const month = {
  "-01-": "Янв",
  "-02-": "Февр",
  "-03-": "Март",
  "-04-": "Апр",
  "-05-": "Май",
  "-06-": "Июнь",
  "-07-": "Июль",
  "-08-": "Авг",
  "-09-": "Сент",
  "-10-": "Окт",
  "-11-": "Нояб",
  "-12-": "Дек",
};

const AnaliticsRF = () => {
  const [dataChart, setDataChart] = useState([]);
  const [emty, setEmty] = useState(false);
  const location = useLocation();
  const removeFirstTag = location.hash.substring(1);
  const [title, setTitle] = useState("Статистика студента: ");

  const filterData = (data) => {
    const arr = [];
    data.forEach((el) => {
      const index = arr.findIndex((elem) => elem.month === el.date);
      if (index !== -1) {
        arr[index][el.type] = el.result;
      } else {
        const row = {};
        for (const key in types) {
          if (key !== el.type) {
            row[key] = 0;
          }
        }
        row[el.type] = Number(el.result);
        const datesp = String(el.date).split("-");
        row.month = month[`-${datesp[1]}-`];
        arr.push(row);
      }
    });
    const newArr = [];
    arr.forEach((el) => {
      const index = newArr.findIndex((elem) => elem.month === el.month);
      if (index !== -1) {
        newArr[index].type_0 += el.type_0;
        newArr[index].type_1 += el.type_1;
        newArr[index].type_2 += el.type_2;
      } else {
        newArr.push(el);
      }
    });
    setDataChart(newArr);
  };
  const fetchData = () => {
    axios
      .get(
        `https://tgbot.f-simple.ru/bot/statistics.php?hash=${removeFirstTag}`
      )
      .then(({ data }) => {
        if (!data.data) {
          setEmty(true);
        } else {
          filterData(data.data);
          setTitle(title + data.user.name + " " + data.user.surname);
        }
      })
      .catch((err) => {
        setEmty(true);
      });
  };
  useEffect(() => {
    fetchData();
  }, [removeFirstTag]);

  return (
    <div className="card">
      {emty ? (
        <div className="not-found">
          <h2>Данные не найдены</h2>
        </div>
      ) : (
        <Chart data={dataChart} className="pr-3">
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis />
          <ValueAxis />

          <AreaSeries
            name="Готов"
            valueField="type_2"
            argumentField="month"
            seriesComponent={Area}
          />
          <AreaSeries
            name="Не готов"
            valueField="type_0"
            argumentField="month"
            seriesComponent={Area}
          />
          <AreaSeries
            name="Частичная"
            valueField="type_1"
            argumentField="month"
            seriesComponent={Area}
          />
          <Animation />
          <Legend position="bottom" rootComponent={Root} />
          <Title text={title} />
        </Chart>
      )}
    </div>
  );
};

export default AnaliticsRF;
