import React, { useLayoutEffect, useRef, useState } from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuFlame,
  LuPlus,
  LuPencil,
  LuScan,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { compressedAirDiagramData } from "../../../Data/Data";
import "./CompressedAir.scss";

function TreeNode({ node, isRoot = false, onOpenModal, navigate, lang }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      id={`node-${node.id}`}
      className={`DAT_Air_Branch ${isRoot ? "DAT_Air_Branch_Root" : ""}`}
    >
      <div className={isRoot ? "DAT_Air_Branch_ZoneRoot" : ""}>
        <div className="DAT_Air_Branch_NodeWrapper">
          {!isRoot && (
            <div className="DAT_Air_Branch_NodeWrapper_ChildLabel">
              {node.data.title}
            </div>
          )}

          <div
            className="DAT_Air_Branch_NodeWrapper_Card"
            onClick={() => navigate(`/compressed-air/${node.id}`)}
          >
            {isRoot ? (
              <div className="DAT_Air_Branch_NodeWrapper_Card_HeaderRoot">
                <h4>{node.data.title}</h4>
                <div className="DAT_Air_Branch_NodeWrapper_Card_Actions">
                  <button
                    type="button"
                    title="Sửa tên trạm tổng"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("edit", node.id, node.data.title);
                    }}
                  >
                    <LuPencil />
                  </button>
                  <button
                    type="button"
                    title={lang.formatMessage({
                      id: "project_monitor_add_child",
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("add", node.id, node.data.title);
                    }}
                  >
                    <LuPlus />
                  </button>
                  <button
                    type="button"
                    className="DAT_Air_Branch_NodeWrapper_Card_Actions_Delete"
                    title={lang.formatMessage({ id: "air_delete_root" })}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("delete", node.id, node.data.title);
                    }}
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ) : (
              <div className="DAT_Air_Branch_NodeWrapper_Card_HeaderSub">
                <div className="DAT_Air_Branch_NodeWrapper_Card_Actions">
                  <button
                    type="button"
                    title="Sửa tên trạm con"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("edit", node.id, node.data.title);
                    }}
                  >
                    <LuPencil />
                  </button>
                  <button
                    type="button"
                    title={lang.formatMessage({
                      id: "project_monitor_add_child",
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("add", node.id, node.data.title);
                    }}
                  >
                    <LuPlus />
                  </button>
                  <button
                    type="button"
                    className="DAT_Air_Branch_NodeWrapper_Card_Actions_Delete"
                    title={lang.formatMessage({
                      id: "project_monitor_delete_station",
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("delete", node.id, node.data.title);
                    }}
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            )}

            <div className="DAT_Air_Branch_NodeWrapper_Card_Body">
              {node.data.metrics.map((m, i) => (
                <p key={i}>
                  <span>
                    {lang.formatMessage({
                      id: i === 0 ? "air_metric_total" : "air_metric_flow",
                    })}
                  </span>
                  <strong>
                    {m.value} {m.unit}
                  </strong>
                </p>
              ))}
            </div>
          </div>

          {hasChildren && (
            <button
              type="button"
              className="DAT_Air_Branch_NodeWrapper_Toggler"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <LuChevronDown /> : <LuChevronUp />}
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <>
          <div className="DAT_Air_Branch_LineDown" />
          <div className="DAT_Air_Branch_ChildrenWrap">
            <div className="DAT_Air_Branch_ChildrenWrap_ZoneChildren">
              <div className="DAT_Air_Branch_ChildrenWrap_ZoneChildren_Grid">
                {node.children.map((child, idx) => {
                  const total = node.children.length;
                  const mid = (total - 1) / 2;
                  const side = idx < mid ? "left" : idx > mid ? "right" : "center";
                  return (
                    <div
                      key={child.id || idx}
                      className={`DAT_Air_Branch_ChildrenWrap_ZoneChildren_Grid_Col DAT_Air_Branch_ChildrenWrap_ZoneChildren_Grid_Col--${side}`}
                    >
                      <div className="DAT_Air_Branch_ChildrenWrap_ZoneChildren_Grid_Col_LineUp" />
                      <TreeNode
                        node={child}
                        onOpenModal={onOpenModal}
                        navigate={navigate}
                        lang={lang}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CompressedAir() {
  const lang = useIntl();
  const navigate = useNavigate();
  const [treeList, setTreeList] = useState(compressedAirDiagramData || []);
  const [currentPage, setCurrentPage] = useState(0);

  const [modal, setModal] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [nameError, setNameError] = useState("");
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [rois, setRois] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState(null);
  const [pendingRoi, setPendingRoi] = useState(null);
  const [, refreshRoiLayout] = useState(0);
  const boardRef = useRef(null);

  const totalPages = treeList.length;
  const currentTree = treeList[currentPage];

  useLayoutEffect(() => {
    refreshRoiLayout((version) => version + 1);
  }, [treeList, currentPage]);

  const getDynamicRoiStyle = (roi) => {
    if (!boardRef.current || !roi.nodeIds || roi.nodeIds.length === 0) {
      return {
        left: `${roi.x}px`,
        top: `${roi.y}px`,
        width: `${roi.width}px`,
        height: `${roi.height}px`,
      };
    }

    const boardNode = boardRef.current;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let found = false;

    roi.nodeIds.forEach((id) => {
      const el = document.getElementById(`node-${id}`);
      if (el) {
        let cur = el;
        let left = 0;
        let top = 0;
        while (cur && cur !== boardNode) {
          left += cur.offsetLeft;
          top += cur.offsetTop;
          cur = cur.offsetParent;
        }

        const right = left + el.offsetWidth;
        const bottom = top + el.offsetHeight;

        if (left < minX) minX = left;
        if (top < minY) minY = top;
        if (right > maxX) maxX = right;
        if (bottom > maxY) maxY = bottom;
        found = true;
      }
    });

    if (!found) {
      return {
        left: `${roi.x}px`,
        top: `${roi.y}px`,
        width: `${roi.width}px`,
        height: `${roi.height}px`,
      };
    }

    const padding = 24;
    return {
      left: `${minX - padding}px`,
      top: `${minY - padding - 10}px`,
      width: `${maxX - minX + padding * 2}px`,
      height: `${maxY - minY + padding * 2 + 10}px`,
    };
  };

  const handleMouseDown = (e) => {
    if (!isDrawingMode || e.button !== 0) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + boardRef.current.scrollLeft;
    const y = e.clientY - rect.top + boardRef.current.scrollTop;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !isDrawingMode) return;
    const rect = boardRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left + boardRef.current.scrollLeft;
    const currentY = e.clientY - rect.top + boardRef.current.scrollTop;

    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);

    setCurrentBox({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !isDrawingMode) return;

    if (currentBox && currentBox.width > 30 && currentBox.height > 30) {
      const boardNode = boardRef.current;
      const matchedNodeIds = [];

      const collectNodes = (node) => {
        if (!node) return;
        const el = document.getElementById(`node-${node.id}`);
        if (el) {
          let cur = el;
          let left = 0;
          let top = 0;
          while (cur && cur !== boardNode) {
            left += cur.offsetLeft;
            top += cur.offsetTop;
            cur = cur.offsetParent;
          }

          const isInBox = (
            left + el.offsetWidth / 2 >= currentBox.x &&
            left + el.offsetWidth / 2 <= currentBox.x + currentBox.width &&
            top + el.offsetHeight / 2 >= currentBox.y &&
            top + el.offsetHeight / 2 <= currentBox.y + currentBox.height
          );

          if (isInBox) {
            matchedNodeIds.push(node.id);
          }
        }
        if (node.children) {
          node.children.forEach((child) => collectNodes(child));
        }
      };

      collectNodes(currentTree);

      if (matchedNodeIds.length >= 1) {
        const defaultName = `KHU VỰC ${rois.filter((r) => r.page === currentPage).length + 1}`;
        setPendingRoi({
          ...currentBox,
          nodeIds: matchedNodeIds,
          page: currentPage,
        });
        setInputVal(defaultName);
        setModal({ type: "add-roi", title: "Gom nhóm (ROI)" });
      } else {
        alert("Không có node nào trong vùng chọn!");
      }

      setIsDrawing(false);
      setCurrentBox(null);
    }
  };

  const handleDeleteRoi = (id) => {
    setRois((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditRoi = (roi, e) => {
    e.stopPropagation();
    setInputVal(roi.label);
    setModal({ type: "edit-roi", id: roi.id, title: "Sửa tên khu vực" });
  };

  const closeModal = () => {
    setModal(null);
    setInputVal("");
    setNameError("");
    setPendingRoi(null);
  };

  const openModal = (type, id = null, title = "") => {
    setInputVal(type === "edit" ? title : "");
    setNameError("");
    setModal({ type, id, title });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (modal.type === "add-roi") {
      if (pendingRoi) {
        setRois((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...pendingRoi,
            label: inputVal.trim().toUpperCase(),
          },
        ]);
      }
      closeModal();
      return;
    }

    if (modal.type === "edit-roi") {
      setRois((prev) =>
        prev.map((r) =>
          r.id === modal.id ? { ...r, label: inputVal.trim().toUpperCase() } : r
        )
      );
      closeModal();
      return;
    }

    const normalizedName = inputVal.trim().toUpperCase();

    if (modal.type !== "add-root") {
      const findParent = (node) => {
        if (node.id === modal.id) return node;
        for (const child of node.children || []) {
          const parent = findParent(child);
          if (parent) return parent;
        }
        return null;
      };
      const parent = findParent(currentTree);
      if (modal.type === "add" && parent?.children?.some((child) => child.data.title.trim().toUpperCase() === normalizedName)) {
        setNameError("Khu vực đã tồn tại.");
        return;
      }

      if (modal.type === "edit" && currentTree.id !== modal.id && parent?.children?.some((child) => child.id !== modal.id && child.data.title.trim().toUpperCase() === normalizedName)) {
        setNameError("Tên node con đã tồn tại trong node cha này.");
        return;
      }
    }

    if (modal.type === "edit") {
      const updateNode = (node) =>
        node.id === modal.id
          ? { ...node, data: { ...node.data, title: normalizedName } }
          : { ...node, children: node.children?.map(updateNode) || [] };

      setTreeList((prev) =>
        prev.map((tree, i) => (i === currentPage ? updateNode(tree) : tree)),
      );
      closeModal();
      return;
    }

    const newNode = {
      id: Date.now(),
      data: {
        title: inputVal.trim().toUpperCase(),
        metrics: [
          { label: "TỔNG TIÊU THỤ KHÍ", value: "0", unit: "Nm³" },
          { label: "LƯU LƯỢNG KHÍ", value: "0.0", unit: "Nm³/h" },
        ],
      },
      children: [],
    };

    if (modal.type === "add-root") {
      setTreeList((prev) => [...prev, newNode]);
      setCurrentPage(totalPages);
    } else {
      const add = (n) =>
        n.id === modal.id
          ? { ...n, children: [...(n.children || []), newNode] }
          : { ...n, children: n.children?.map(add) || [] };

      setTreeList((prev) =>
        prev.map((tree, i) => (i === currentPage ? add(tree) : tree)),
      );
    }
    closeModal();
  };

  const handleDeleteSubmit = () => {
    const isRoot = currentTree?.id === modal.id;

    if (isRoot) {
      setTreeList((prev) => {
        const next = prev.filter((t) => t.id !== modal.id);
        setCurrentPage((p) => Math.min(p, Math.max(0, next.length - 1)));
        return next;
      });
    } else {
      const remove = (n) => ({
        ...n,
        children: (n.children || [])
          .filter((c) => c.id !== modal.id)
          .map(remove),
      });
      setTreeList((prev) =>
        prev.map((tree, i) => (i === currentPage ? remove(tree) : tree)),
      );
    }
    closeModal();
  };

  return (
    <div className="DAT_Air">
      <div className="DAT_Air_TextHeader">
        <button
          className="DAT_Air_TextHeader_BackBtn"
          onClick={() => navigate("/dashboard")}
        >
          <LuChevronLeft />
        </button>
        <div className="DAT_Air_TextHeader_SystemTag">
          <LuFlame />{" "}
          <span>{lang.formatMessage({ id: "air_system_title" })}</span>
        </div>
      </div>

      <div className="DAT_Air_TopBar">
        <button
          type="button"
          className={`DAT_Air_TopBar_RoiBtn ${isDrawingMode ? "active" : ""}`}
          title={isDrawingMode ? "Tắt chế độ vẽ ROI" : "Bật vẽ ROI gom nhóm"}
          onClick={() => setIsDrawingMode((prev) => !prev)}
        >
          <LuScan />
          <span>{isDrawingMode ? "Xác nhận" : "Vẽ ROI"}</span>
        </button>

        <button
          type="button"
          className="DAT_Air_TopBar_AddRootBtn"
          onClick={() => openModal("add-root", null, "TRẠM TỔNG KHÍ")}
        >
          <LuPlus />{" "}
          <span>{lang.formatMessage({ id: "air_create_root" })}</span>
        </button>
      </div>

      <div className="DAT_Air_CanvasWrap">
        <div className="DAT_Air_CanvasWrap_NavSlot">
          <button
            type="button"
            className="DAT_Air_CanvasWrap_NavSlot_NavBtn"
            disabled={totalPages === 0}
            onClick={() =>
              setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1))
            }
          >
            <LuChevronLeft />
          </button>
        </div>

        <div className="DAT_Air_CanvasWrap_ScrollContainer">
          <div
            ref={boardRef}
            className="DAT_Air_CanvasWrap_ScrollContainer_MainBoard"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              cursor: isDrawingMode ? "crosshair" : "default",
              userSelect: isDrawingMode ? "none" : "auto",
            }}
          >
            {rois
              .filter((roi) => roi.page === currentPage)
              .map((roi) => {
                const dynamicStyle = getDynamicRoiStyle(roi);
                return (
                  <div
                    key={roi.id}
                    className="DAT_Air_RoiBox"
                    style={{
                      ...dynamicStyle,
                      pointerEvents: "none",
                      zIndex: 5,
                    }}
                  >
                    <div
                      className="DAT_Air_RoiBox_Badge"
                      style={{
                        pointerEvents: "auto",
                      }}
                    >
                      <span>{roi.label}</span>
                      {!isDrawingMode && (
                        <div style={{ display: "flex", gap: "4px", alignItems: "center", marginLeft: "4px" }}>
                          <LuPencil
                            size={12}
                            title="Sửa tên khu vực"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRoi(roi, e);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <LuX
                            size={12}
                            title="Xóa khu vực"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoi(roi.id);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {currentBox && isDrawing && (
              <div
                className="DAT_Air_RoiDrawingBox"
                style={{
                  left: `${currentBox.x}px`,
                  top: `${currentBox.y}px`,
                  width: `${currentBox.width}px`,
                  height: `${currentBox.height}px`,
                }}
              />
            )}

            {pendingRoi && modal?.type === "add-roi" && (
              <div
                className="DAT_Air_RoiDrawingBox"
                style={{
                  left: `${pendingRoi.x}px`,
                  top: `${pendingRoi.y}px`,
                  width: `${pendingRoi.width}px`,
                  height: `${pendingRoi.height}px`,
                }}
              />
            )}

            <div className="DAT_Air_CanvasWrap_ScrollContainer_MainBoard_Canvas">
              {currentTree && (
                <TreeNode
                  key={currentTree.id || currentPage}
                  node={currentTree}
                  isRoot
                  onOpenModal={openModal}
                  navigate={navigate}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>

        <div className="DAT_Air_CanvasWrap_NavSlot">
          <button
            type="button"
            className="DAT_Air_CanvasWrap_NavSlot_NavBtn"
            disabled={totalPages === 0}
            onClick={() =>
              setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : 0))
            }
          >
            <LuChevronRight />
          </button>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="DAT_Air_PageIndicator">
          {currentPage + 1}/{totalPages}
        </div>
      )}

      {modal && (
        <div className="DAT_Air_ModalOverlay" onClick={closeModal}>
          <div
            className="DAT_Air_ModalOverlay_Modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DAT_Air_ModalOverlay_Modal_Header">
              <h3>
                {modal.type === "delete"
                  ? lang.formatMessage({ id: "project_monitor_confirm_delete" })
                  : modal.type === "add-root"
                    ? lang.formatMessage({ id: "air_create_root_title" })
                    : modal.type === "add-roi"
                      ? "ĐẶT TÊN NHÓM KHU VỰC (ROI)"
                      : modal.type === "edit-roi"
                        ? "CHỈNH SỬA TÊN KHU VỰC"
                        : modal.type === "edit"
                          ? "CHỈNH SỬA TÊN NODE"
                          : lang.formatMessage(
                            { id: "project_monitor_add_child_for" },
                            { title: modal.title },
                          )}
              </h3>
              <button type="button" onClick={closeModal}>
                <LuX />
              </button>
            </div>

            {modal.type === "delete" ? (
              <div>
                <div className="DAT_Air_ModalOverlay_Modal_Body">
                  <p>
                    {lang.formatMessage(
                      { id: "project_monitor_delete_message" },
                      { title: modal.title },
                    )}
                  </p>
                </div>
                <div className="DAT_Air_ModalOverlay_Modal_Footer">
                  <button
                    type="button"
                    className="DAT_Air_ModalOverlay_Modal_Footer_BtnCancel"
                    onClick={closeModal}
                  >
                    {lang.formatMessage({ id: "project_monitor_cancel" })}
                  </button>
                  <button
                    type="button"
                    className="DAT_Air_ModalOverlay_Modal_Footer_BtnDelete"
                    onClick={handleDeleteSubmit}
                  >
                    {lang.formatMessage({ id: "project_monitor_delete_now" })}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit}>
                <div className="DAT_Air_ModalOverlay_Modal_Body">
                  <label>
                    {modal.type === "add-root"
                      ? lang.formatMessage({ id: "air_root_name" })
                      : modal.type === "add-roi" || modal.type === "edit-roi"
                        ? "Tên khu vực:"
                        : modal.type === "edit"
                          ? "Tên node:"
                          : lang.formatMessage({
                            id: "project_monitor_child_station_name",
                          })}
                  </label>
                  <input
                    autoFocus
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      setNameError("");
                    }}
                    placeholder={
                      modal.type === "add-root"
                        ? lang.formatMessage({
                          id: "air_root_placeholder",
                        })
                        : modal.type === "add-roi" || modal.type === "edit-roi"
                          ? "Nhập tên nhóm (VD: KHU VỰC SẢN XUẤT)..."
                          : modal.type === "edit"
                            ? "Nhập tên node..."
                            : lang.formatMessage({
                              id: "air_child_placeholder",
                            })
                    }
                  />
                  {nameError && (
                    <p style={{ color: "rgba(248, 113, 113, 1)", fontSize: "12px", margin: "6px 0 0" }}>
                      {nameError}
                    </p>
                  )}
                </div>
                <div className="DAT_Air_ModalOverlay_Modal_Footer">
                  <button
                    type="button"
                    className="DAT_Air_ModalOverlay_Modal_Footer_BtnCancel"
                    onClick={closeModal}
                  >
                    {lang.formatMessage({ id: "project_monitor_cancel" })}
                  </button>
                  <button
                    type="submit"
                    className="DAT_Air_ModalOverlay_Modal_Footer_BtnSubmit"
                  >
                    {lang.formatMessage({ id: "project_monitor_confirm" })}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}