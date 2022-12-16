import {ReactElement, useState} from "react";
import {useD3} from "../hooks/useD3";
import {VennDiagram, sortAreas} from "@upsetjs/venn.js";
import {Container, Loader, Box, Paper, Center, Group} from "@mantine/core";
import * as d3 from 'd3';
import {random} from "nanoid";


function EulerChart( { data }:{ data: { size:number, sets:string[] }[]} ) {
    const [loading, setLoading] = useState(true);
    const colors = [
        "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7",
        "#5C7CFA", "#339AF0", "#22B8CF", "#20C997",
        "#51CF66", "#94D82D", "#FCC419", "#FF922B",
    ]
    // console.log(JSON.stringify(data, null, 2))
    const ref = useD3(
        (div) => {
            const height = 600;
            const width = 800;
            const margin = {top: 20, right: 30, bottom: 30, left: 40};

            function updateData() {
                return data;
            }

            try {
                div.attr("viewBox", `0 0 ${width} ${height}`);
                div.attr("height", height);
                div.attr("width", width);
                div.attr("margin", "auto");
                div.datum(updateData()).call(VennDiagram({symmetricalTextCentre: true, colorScheme: colors}).height(height).width(width));
                d3.selectAll(".venn-circle").each(function (d) {
                    let circle = d3.select(this).select("path")
                    let text = d3.select(this).select("text")
                    let color = d3.rgb(circle.style("fill"))
                    if (color.r == 255 && color.g == 107 && color.b == 107) {
                        console.log("Default color")
                        const newColor = colors[Math.floor(Math.random() * colors.length)]
                        circle.style("fill", newColor)
                        text.style("fill", newColor)
                    }

                })

                d3.selectAll(".venn-area").transition();
                    // .on("mouseover", function(d, i) {
                    //     let node = d3.select(this).transition();
                    //     node.select("path").style("fill-opacity", .5);
                    //     node.select("text").style("font-weight", "100")
                    //         .style("font-size", "24px");
                    // })
                    // .on("mouseout", function(d, i) {
                    //     let node = d3.select(this).transition();
                    //     node.select("path").style("fill-opacity", .3);
                    //     node.select("text").style("font-weight", "100")
                    //         .style("font-size", "16px");
                    // });

                setLoading(false);
            } catch {}
        },
        [data]
    );

    return (
        <Paper
            id={"venn"}
            radius={"xl"}
            sx={(theme) => ({
                height: 600,
                marginTop: "12px"
            })}
        >
            <Center>
                {loading ? <Loader color="green" variant="bars"/> : ''}
                <svg
                    //@ts-ignore
                    ref={ref}
                >

                </svg>
            </Center>
        </Paper>
    );
}

export default EulerChart;