import Router from "next/router";

export const Calendar = ({ mm }: { mm: number }) => {
    const date = new Date();
    date.setMonth(date.getMonth() + mm);
    const month = date.getMonth();
    const lastDate = new Date(date.getFullYear(), month + 1, 0).getDate();
    const table = [];
    const line = Math.ceil(lastDate / 7);
    let count = 1;
    for (let i = 0; i < line; i++) {
        let tempLine = [];
        for (let j = 0; j < (i + 1 == line ? lastDate - 7 * i : 7); j++) {
            tempLine.push(count);
            count++;
        }
        table.push(tempLine);
    }
    return (
        <div>
            <table>
                <thead>
                    <th colSpan={7}>{month + 1}</th>
                </thead>
                <tbody>
                    {table.map((line) => (
                        <tr>
                            {line.map((item) => (
                                <td>{item}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
