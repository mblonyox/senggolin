type Props = {
  links: {
    path: string;
    url: string;
    createdAt: Date;
    clicks: number;
  }[];
};

export default function LinksTable({ links }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tautan</th>
          <th scope="col">Dibuat pada</th>
          <th scope="col">Jumlah klik</th>
        </tr>
      </thead>
      <tbody>
        {links.map(({ url, path, createdAt, clicks }, index) => (
          <tr>
            <th scope="row">{index + 1}</th>
            <td>
              <a href={"https://senggol.in/" + path} data-tooltip={url}>
                https://senggol.in/{path}
              </a>
            </td>
            <td>
              {createdAt.toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </td>
            <td>
              {clicks}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
