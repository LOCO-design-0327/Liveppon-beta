import { X, Save, Upload, Trash2, Layers } from "lucide-react";
import { useState } from "react";
import type { Product } from "../types";

interface Scene {
  id: string;
  name: string;
  products: Product[];
  createdAt: Date;
}

interface SceneManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  currentProducts: Product[];
  onSaveScene: (name: string, products: Product[]) => void;
  onLoadScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
}

export function SceneManagementModal({
  isOpen,
  onClose,
  scenes,
  currentProducts,
  onSaveScene,
  onLoadScene,
  onDeleteScene,
}: SceneManagementModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [sceneName, setSceneName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!sceneName.trim()) {
      alert("シーン名を入力してください");
      return;
    }
    onSaveScene(sceneName, currentProducts);
    setSceneName("");
    setIsSaving(false);
  };

  const handleLoad = (scene: Scene) => {
    if (
      confirm(
        "現在の商品一覧を上書きして、このシーンを呼び出しますか？"
      )
    ) {
      onLoadScene(scene);
      onClose();
    }
  };

  const handleDelete = (sceneId: string) => {
    if (confirm("このシーンを削除しますか？")) {
      onDeleteScene(sceneId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
      >
      <div className="bg-background border border-border rounded-lg w-[700px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            <h2>シーン管理</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isSaving ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  シーン名
                </label>
                <input
                  type="text"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  placeholder="例: side REAL 2026"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                  autoFocus
                />
              </div>
              <div className="text-sm text-muted-foreground">
                現在の商品{currentProducts.length}件を保存します
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsSaving(false);
                    setSceneName("");
                  }}
                  className="flex-1 py-2 bg-secondary rounded-lg hover:bg-secondary/80"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsSaving(true)}
                className="w-full py-3 mb-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                現在の状態をシーン保存
              </button>

              {scenes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  保存済みシーンがありません
                </div>
              ) : (
                <div className="space-y-2">
                  {scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="p-4 bg-card rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div>{scene.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {scene.products.length}件 ·{" "}
                          {new Date(scene.createdAt).toLocaleDateString(
                            "ja-JP"
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoad(scene)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          呼び出し
                        </button>
                        <button
                          onClick={() => handleDelete(scene.id)}
                          className="w-10 h-10 rounded bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
