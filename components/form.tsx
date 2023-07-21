type Props = {
  url?: string;
  path?: string;
  errors?: {
    url?: string;
    path?: string;
  };
};

export default function Form({ url, path, errors }: Props) {
  return (
    <form action="/" method="POST">
      <label htmlFor="url">
        URL
        <input
          type="text"
          name="url"
          id="url"
          placeholder="https://example.com/long-url-you-want-to-shorten"
          value={url}
        />
        {errors?.url && <small style={{ color: "red" }}>{errors.url}</small>}
      </label>
      <label htmlFor="path">Path</label>
      <div className="grid" style={{ gridTemplateColumns: "auto 1fr" }}>
        <strong
          style={{
            marginBottom: "var(--spacing)",
            padding:
              "var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal)",
          }}
        >
          https://senggol.in/
        </strong>
        <input
          type="text"
          name="path"
          id="path"
          placeholder="path-yang-diinginkan"
          value={path}
        />
      </div>
      {errors?.path && <small style={{ color: "red" }}>{errors.path}</small>}
      <button type="submit">Buat Tautan</button>
    </form>
  );
}
