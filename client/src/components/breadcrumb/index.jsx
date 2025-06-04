import { Link } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Slash } from "lucide-react";

const BreadcrumbCustom = ({ pageName }) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className={"text-zinc-200  "}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={"/dashboard/users"}>Users</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-bold text-zinc-50">{pageName}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCustom;
