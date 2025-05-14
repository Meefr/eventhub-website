import { useTheme } from "../../contexts/ThemeContext";

const Table = ({ data = [], columns = [], emptyMessage = 'No data available' }) => {
  const { darkMode } = useTheme();

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-tablelight' : 'text-tabledark'}`}>
        {emptyMessage}
      </div>
    );
  }

  data = data.data ? data.data : data;

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y shadow-lg rounded-lg 
        ${darkMode ? 'bg-tabledark text-light divide-gray-200' : 'bg-tablelight text-dark divide-gray-900 divide-y-2'}`}>
        
        <thead className={darkMode ? 'bg-tabledark text-light' : 'bg-tablelight text-dark'}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={`${darkMode ? 'bg-tabledark text-light divide-gray-700' : 'bg-tablelight text-dark divide-gray-700'} divide-y`}>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm"
                >
                  {column.render
                    ? column.render(item[column.accessor], item)
                    : column.format
                    ? column.format(item[column.accessor])
                    : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
