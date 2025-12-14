import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { productApi } from "@/api/products";
import { categoryApi } from "@/api/categories";
import { authorApi } from "@/api/authors";
import { publisherApi } from "@/api/publishers";
import { unwrapList } from "@/utils/unwrap";

import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductMeta from "./components/ProductMeta";
import ProductDescription from "./components/ProductDescription";
import AddToCartBox from "./components/AddToCartBox";
import Section from "@/components/common/Section";

import { NO_IMAGE_PLACEHOLDER } from "@/utils/imagePlaceholder";
import ProductCard from "@/components/product/ProductCard";
import RelatedProductCarousel from "@/components/related/RelatedProductCarousel";
import { useLookupEntity } from "@/hooks/useLookupEntity";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any | null>(null);

  const { data: category } = useLookupEntity("category", product?.category_id);
  const { data: author } = useLookupEntity("author", product?.author_id);
  const { data: publisher } = useLookupEntity(
    "publisher",
    product?.publisher_id
  );

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 1. Product
        const res = await productApi.getById(id);
        const p = res?.data?.data ?? res?.data ?? null;
        if (!mounted || !p) return;

        setProduct(p);

        // 2. Related products (DÙNG PRODUCTS API)
        setLoadingRelated(true);
        try {
          if (p.category_id) {
            const res = await productApi.list({
              page: 1,
              pageSize: 8,
              category_id: p.category_id,
              sortBy: "created_at",
              sortDir: "DESC",
            });

            const list = unwrapList(res).filter((x: any) => x.id !== p.id);

            setRelatedProducts(list);
          }
        } finally {
          mounted && setLoadingRelated(false);
        }
        
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [NO_IMAGE_PLACEHOLDER];
    const arr = [
      product.main_image,
      ...(Array.isArray(product.extra_images) ? product.extra_images : []),
    ].filter(Boolean);
    return arr.length ? arr : [NO_IMAGE_PLACEHOLDER];
  }, [product]);

  return (
    <Box
      sx={{
        py: 3,
        px: { xs: 1.5, sm: 2, md: 0 }, // 👈 giảm padding ngang
      }}
    >
      {" "}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </Link>
        <Typography color="text.secondary">
          {loading ? "Đang tải..." : product?.name}
        </Typography>
      </Breadcrumbs>
      {loading ? (
        <Skeleton variant="rounded" height={520} />
      ) : !product ? (
        <Typography>Không tìm thấy sản phẩm.</Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "420px 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <ProductGallery images={images} />

            <Stack spacing={2}>
              <ProductInfo product={product} />
              <ProductMeta
                category={category}
                author={author}
                publisher={publisher}
              />
              <AddToCartBox product={product} />
            </Stack>
          </Box>

          <Box sx={{ mt: 4 }}>
            <ProductDescription description={product.description} />
          </Box>

          <Section title="Sản phẩm liên quan">
            <RelatedProductCarousel
              products={relatedProducts}
              loading={loadingRelated}
              maxItems={8}
            />
          </Section>
        </>
      )}
    </Box>
  );
}
