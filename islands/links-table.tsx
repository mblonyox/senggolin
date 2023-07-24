import { Signal } from "@preact/signals";

type Props = {
  links: Signal<{
    path: string;
    url: string;
    createdAt: Date;
    clicks: number;
  }[]>;
};

export default function LinksTable({ links }: Props) {
  const handleDelete = async (path: string) => {
    if (!window.confirm("Anda yakin menghapus tautan?")) return;
    const resp = await fetch(`${path}`, { method: "DELETE" });
    if (resp.ok) links.value = links.value.filter((l) => l.path !== path);
  };

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tautan</th>
          <th scope="col">Dibuat pada</th>
          <th scope="col">Jumlah klik</th>
          <th scope="col">Hapus</th>
        </tr>
      </thead>
      <tbody>
        {links.value.map(({ url, path, createdAt, clicks }, index) => (
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
            <td>
              <button onClick={() => handleDelete(path)}>
                <img
                  src="/icons/delete.svg"
                  alt="Delete"
                  width={24}
                  height={24}
                />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
