import { Component, OnInit } from '@angular/core';
import Chart from "chart.js";
import { chartOptions, parseOptions, chartExample1, chartExample2 } from "../../variables/charts";

@Component({
  	selector: 'app-viatico', 
  	templateUrl: './viatico.component.html',
  	styleUrls: ['./viatico.component.css']
})
export class ViaticoComponent implements OnInit
{
	public datasets: any;
	public data: any;
	public salesChart;
	public clicked: boolean = true;
	public clicked1: boolean = false;

	constructor()
	{}

	ngOnInit()
	{
		this.datasets = [
		[0, 20, 10, 30, 15, 40, 20, 60, 60],
		[0, 20, 5, 25, 10, 30, 15, 40, 40]
		];
		this.data = this.datasets[0];

		var chartOrders = document.getElementById("chart-bars");

		parseOptions(Chart, chartOptions());

		var ordersChart = new Chart(chartOrders, {
		type: "bar",
		options: chartExample2.options,
		data: chartExample2.data
		});

		var chartSales = document.getElementById("chart-sales-dark");

		this.salesChart = new Chart(chartSales, {
		type: "line",
		options: chartExample1.options,
		data: chartExample1.data
		});
	}

	public updateOptions() {
		this.salesChart.data.datasets[0].data = this.data;
		this.salesChart.update();
	}
}
