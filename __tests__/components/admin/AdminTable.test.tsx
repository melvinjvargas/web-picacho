import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminTable } from "@/components/admin/data-display/AdminTable";

// ─── Test helpers & data ─────────────────────────────────────────────────────

afterEach(cleanup);

type TRow = Record<string, unknown>;

const columns = [
  { key: "name", header: "Nombre" },
  { key: "status", header: "Estado" },
];

const data: TRow[] = [
  { id: 1, name: "Camisa Río", status: "Activo" },
  { id: 2, name: "Gorra Sendero", status: "Inactivo" },
];

const keyExtractor = (row: TRow) => String(row.id);

// ─── Rendering with data ─────────────────────────────────────────────────────

describe("AdminTable data rendering", () => {
  it("renders column headers", () => {
    render(
      <AdminTable columns={columns} data={data} keyExtractor={keyExtractor} />,
    );

    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
  });

  it("renders all data rows", () => {
    render(
      <AdminTable columns={columns} data={data} keyExtractor={keyExtractor} />,
    );

    expect(screen.getByText("Camisa Río")).toBeInTheDocument();
    expect(screen.getByText("Gorra Sendero")).toBeInTheDocument();
    expect(screen.getByText("Activo")).toBeInTheDocument();
    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });

  it("uses render function for custom column content", () => {
    const columnsWithRender = [
      { key: "name", header: "Nombre" },
      {
        key: "actions",
        header: "Acciones",
        render: (row: TRow) => (
          <button data-testid={`edit-${row.id}`}>Edit</button>
        ),
      },
    ];

    render(
      <AdminTable
        columns={columnsWithRender}
        data={data}
        keyExtractor={keyExtractor}
      />,
    );

    expect(screen.getByTestId("edit-1")).toBeInTheDocument();
    expect(screen.getByTestId("edit-2")).toBeInTheDocument();
    // Multiple "Edit" buttons exist — use getAllByText
    expect(screen.getAllByText("Edit")).toHaveLength(2);
  });

  it("applies column width styles when specified", () => {
    const columnsWithWidth = [
      { key: "name", header: "Nombre", width: "200px" },
      { key: "status", header: "Estado", width: "150px" },
    ];

    const { container } = render(
      <AdminTable
        columns={columnsWithWidth}
        data={data}
        keyExtractor={keyExtractor}
      />,
    );

    const th = container.querySelectorAll("th");
    expect(th[0].style.width).toBe("200px");
    expect(th[1].style.width).toBe("150px");
  });
});

// ─── Empty state ─────────────────────────────────────────────────────────────

describe("AdminTable empty state", () => {
  it("shows default empty message when no data", () => {
    render(
      <AdminTable columns={columns} data={[]} keyExtractor={keyExtractor} />,
    );

    expect(screen.getByText("Sin resultados.")).toBeInTheDocument();
  });

  it("shows custom empty message", () => {
    render(
      <AdminTable
        columns={columns}
        data={[]}
        keyExtractor={keyExtractor}
        emptyMessage="No hay productos aún"
      />,
    );

    expect(screen.getByText("No hay productos aún")).toBeInTheDocument();
    expect(screen.queryByText("Sin resultados.")).not.toBeInTheDocument();
  });

  it("does not show empty message when data exists", () => {
    render(
      <AdminTable columns={columns} data={data} keyExtractor={keyExtractor} />,
    );

    expect(screen.queryByText("Sin resultados.")).not.toBeInTheDocument();
  });
});

// ─── Loading skeleton ────────────────────────────────────────────────────────

describe("AdminTable loading state", () => {
  it("renders skeleton rows when loading", () => {
    const { container } = render(
      <AdminTable
        columns={columns}
        data={[]}
        keyExtractor={keyExtractor}
        loading={true}
      />,
    );

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("does not render data or empty message while loading", () => {
    render(
      <AdminTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        loading={true}
      />,
    );

    expect(screen.queryByText("Camisa Río")).not.toBeInTheDocument();
    expect(screen.queryByText("Sin resultados.")).not.toBeInTheDocument();
  });

  it("renders data when loading is false", () => {
    render(
      <AdminTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Camisa Río")).toBeInTheDocument();
  });
});

// ─── Error banner ────────────────────────────────────────────────────────────

describe("AdminTable error state", () => {
  it("renders error banner when error is set", () => {
    render(
      <AdminTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        error="Error al cargar los productos"
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Error al cargar los productos");
  });

  it("does not render error banner when error is null", () => {
    render(
      <AdminTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        error={null}
      />,
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders data alongside error banner", () => {
    render(
      <AdminTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        error="Aviso: datos parciales"
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Camisa Río")).toBeInTheDocument();
  });
});

// ─── Custom render columns ───────────────────────────────────────────────────

describe("AdminTable custom render", () => {
  it("renders React nodes from render function", () => {
    const columnsWithStatusBadge = [
      { key: "name", header: "Nombre" },
      {
        key: "status",
        header: "Estado",
        render: (row: TRow) => (
          <span
            data-testid={`badge-${row.id}`}
            className={row.status === "Activo" ? "text-green-600" : "text-gray-400"}
          >
            {row.status as string}
          </span>
        ),
      },
    ];

    render(
      <AdminTable
        columns={columnsWithStatusBadge}
        data={data}
        keyExtractor={keyExtractor}
      />,
    );

    const activeBadge = screen.getByTestId("badge-1");
    expect(activeBadge).toHaveTextContent("Activo");
    expect(activeBadge.className).toContain("text-green-600");

    const inactiveBadge = screen.getByTestId("badge-2");
    expect(inactiveBadge).toHaveTextContent("Inactivo");
    expect(inactiveBadge.className).toContain("text-gray-400");
  });

  it("falls back to String() for columns without render", () => {
    render(
      <AdminTable columns={columns} data={data} keyExtractor={keyExtractor} />,
    );

    expect(screen.getByText("Activo")).toBeInTheDocument();
  });
});
