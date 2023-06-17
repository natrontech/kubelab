<script>
  import { Line } from "svelte-chartjs";

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  } from "chart.js";
  import { data } from "./data";

  ChartJS.register(Title, Tooltip, LineElement, LinearScale, PointElement, CategoryScale);
</script>

<Line {data} options={{ responsive: true }} />
