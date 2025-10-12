import { useState } from "react";
import { Globe } from "lucide-react";
import { useTravellerTravelHistoryQuery } from "../../../hooks/useTravellerHook";
import { TablePagination } from "@mui/material";


const TravelHistory: React.FC<{ personId: string }> = ({ personId }) => {
    const [query, setQuery] = useState({
        page: 1,
        size: 20,
        search: "",
        sortBy: "TravelDate",
        sortDirection: "DESC" as "ASC" | "DESC",
        startDate: "",
        endDate: "",
        personId: personId,
    });

    const handleChangePage = (_event: unknown, newPage: number) => {
        setQuery({ ...query, page: newPage + 1 });
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setQuery({ ...query, page: 1, size: +event.target.value });
    };

    const { data: travelHistory, isLoading: loading } = useTravellerTravelHistoryQuery(
        personId, 
        query.page, 
        query.size, 
        query.search, 
        query.sortBy, 
        query.sortDirection,
        query.startDate,
        query.endDate
    )

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-row justify-between">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" /> Travel History
                </h3>
                <div className="flex flex-wrap gap-2 items-center mb-4">
                    <input
                        type="date"
                        value={query.startDate}
                        onChange={(e) =>
                            setQuery({ ...query, startDate: e.target.value })
                        }
                        className="border p-2 rounded-lg text-sm"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={query.endDate}
                        onChange={(e) =>
                            setQuery({ ...query, endDate: e.target.value })
                        }
                        className="border p-2 rounded-lg text-sm"
                    />
                    <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Export CSV
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">State</th>
                        <th className="p-2 border">Country Issued</th>
                        {/* <th className="p-2 border">Border Point</th> */}
                        <th className="p-2 border">Type</th>
                    </tr>
                </thead>
                {!loading && (
                    <tbody>
                        {travelHistory?.data.map((h) => (
                            <tr key={h.ID} className="border-t hover:bg-gray-50">
                                <td className="p-2">{h.BorderCrossDate}</td>
                                <td className="p-2">{h.location == '1' ? 'Abuja' : 'Lagos'}</td>
                                <td className="p-2 flex items-center gap-2">
                                    {h.CountryIssued?.Name}
                                </td>
                                {/* <td className="p-2">{h.point}</td> */}
                                <td
                                    className={`p-2 font-medium ${h.BorderCrossDirectionID === 1 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {h.BorderCrossDirectionID == 1 ? 'Entry' : 'Exit'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
                {loading && (
                    <tbody>
                        <tr>
                            Loading ....
                        </tr>
                    </tbody>
                )}
            </table>

            <div className="mt-4 flex justify-end gap-2">
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={travelHistory?.meta.total || 10}
                    rowsPerPage={10}
                    page={
                        travelHistory?.meta.page ? travelHistory?.meta.page - 1 : 0
                    }
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
};

export default TravelHistory;
